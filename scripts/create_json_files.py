#!/usr/bin/env python3
"""
create_json_files.py

Create JSON files with initial structure.

This script does NOT print secret values to stdout/stderr.
"""
import os
import json
import shutil
import sys
import tempfile
from dotenv import load_dotenv

load_dotenv()


def atomic_write(path, data):
    dirpath = os.path.dirname(path) or "."
    fd, tmp = tempfile.mkstemp(dir=dirpath)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            f.write("\n")
        shutil.move(tmp, path)
    finally:
        if os.path.exists(tmp):
            try:
                os.remove(tmp)
            except Exception:
                pass


def inject_expo_public_env(eas_data):
    expo_public_env_keys = [
        "EXPO_PUBLIC_SUPABASE_TABLE",
        "EXPO_PUBLIC_SUPABASE_SCHEMA",
        "EXPO_PUBLIC_SUPABASE_URL",
        "EXPO_PUBLIC_SUPABASE_KEY",
    ]

    env_values = {
        key: value
        for key in expo_public_env_keys
        if (value := os.getenv(key))
    }

    if not env_values:
        return eas_data

    build = eas_data.setdefault("build", {})
    for profile_name in ("development", "preview", "production"):
        profile = build.setdefault(profile_name, {})
        profile_env = profile.setdefault("env", {})
        profile_env.update(env_values)

    return eas_data


def main():
    eas_json_str = os.getenv("EAS_JSON")
    google_services_str = os.getenv("GOOGLE_SERVICES_JSON")

    missing = []
    if not eas_json_str:
        missing.append("EAS_JSON")
    if not google_services_str:
        missing.append("GOOGLE_SERVICES_JSON")
    if missing:
        print(
            f"ERROR: Missing required environment variable(s): {', '.join(missing)}",
            file=sys.stderr,
        )
        return 1

    try:
        eas_data = json.loads(eas_json_str)
    except json.JSONDecodeError as e:
        print(f"ERROR: EAS_JSON is not valid JSON: {e}", file=sys.stderr)
        return 1
    eas_data = inject_expo_public_env(eas_data)
    atomic_write("eas.json", eas_data)
    print("Wrote eas.json")

    try:
        gs_data = json.loads(google_services_str)
    except json.JSONDecodeError as e:
        print(f"ERROR: GOOGLE_SERVICES_JSON is not valid JSON: {e}", file=sys.stderr)
        return 1
    atomic_write("google-services.json", gs_data)
    print("Wrote google-services.json")

    return 0


if __name__ == "__main__":
    sys.exit(main())