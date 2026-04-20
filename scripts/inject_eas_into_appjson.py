#!/usr/bin/env python3
"""
inject_eas_into_appjson.py

Inject `expo.owner` and `expo.extra.eas.projectId` into app.config.json from
environment variables `EAS_OWNER` and `EAS_PROJECT_ID`.

This script does NOT print secret values to stdout/stderr.
"""
import os
import json
import shutil
import sys
import tempfile
from dotenv import load_dotenv

load_dotenv()

def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


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


def main():
    path = "app.config.json"
    # load or create minimal structure
    if os.path.exists(path):
        try:
            data = load_json(path)
        except Exception:
            data = {"expo": {}}
    else:
        data = {"expo": {}}

    expo = data.setdefault("expo", {})

    owner = os.getenv("EAS_OWNER")
    project_id = os.getenv("EAS_PROJECT_ID")

    if owner:
        expo["owner"] = owner

    extra = expo.setdefault("extra", {})
    eas = extra.setdefault("eas", {})
    if project_id:
        eas["projectId"] = project_id

    atomic_write(path, data)
 
    print(f"Updated {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())