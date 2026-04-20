import json
import os

def find_error_log_levels(json_file_path):
    """
    Parses a JSON file to find all log entries with a logLevel of 'ERROR'.

    Args:
        json_file_path (str): Path to the JSON file.

    Returns:
        list: A list of log entries with logLevel 'ERROR'.
    """
    try:
        # Open and load the JSON file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Extract logcatMessages and filter logs with logLevel 'ERROR'
        logcat_messages = data.get('logcatMessages', [])
        error_logs = [log for log in logcat_messages if log.get('header', {}).get("logLevel") == "ERROR"]

        return error_logs

    except FileNotFoundError:
        print(f"Error: File not found at {json_file_path}")
    except json.JSONDecodeError:
        print(f"Error: Failed to decode JSON in file {json_file_path}. Please check the file format.")
    except Exception as e:
        print(f"An unexpected error occurred while processing {json_file_path}: {e}")
        return []

def save_error_logs_to_file(error_logs, output_file_path):
    """
    Saves the filtered error logs to a new JSON file.

    Args:
        error_logs (list): List of error logs to save.
        output_file_path (str): Path to the output JSON file.
    """
    try:
        with open(output_file_path, 'w') as file:
            json.dump(error_logs, file, indent=4)
        print(f"Error logs saved to {output_file_path}")
    except Exception as e:
        print(f"Failed to save error logs to {output_file_path}: {e}")

def process_all_logcat_files(input_dir, output_dir):
    """
    Processes all .logcat files in the input directory, parses them, and saves error logs to the output directory.

    Args:
        input_dir (str): Path to the input directory containing .logcat files.
        output_dir (str): Path to the output directory to save error logs.
    """
    # Ensure the output directory exists
    os.makedirs(output_dir, exist_ok=True)

    # Iterate over all .logcat files in the input directory
    for file_name in os.listdir(input_dir):
        if file_name.endswith('.logcat'):
            input_file_path = os.path.join(input_dir, file_name)
            output_file_path = os.path.join(output_dir, f"{os.path.splitext(file_name)[0]}_error_logs.json")

            print(f"Processing file: {input_file_path}")

            # Find error logs in the current file
            error_logs = find_error_log_levels(input_file_path)

            if error_logs:
                # Save error logs to the output file
                save_error_logs_to_file(error_logs, output_file_path)
            else:
                print(f"No error logs found in {input_file_path}.")

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_dir = os.path.join(script_dir, 'input')
    output_dir = os.path.join(script_dir, 'output')

    process_all_logcat_files(input_dir, output_dir)