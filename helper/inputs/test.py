import os
from typing import List


def list_directory_contents(
    start_path: str, output_file: str, ignored_folders: List[str] = None
):
    if ignored_folders is None:
        ignored_folders = ["node_modules", ".git", "__pycache__", "venv"]

    # Handle invalid path
    if not os.path.exists(start_path):
        print(f"Error: Path '{start_path}' does not exist")
        return

    try:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(f"Directory listing for: {start_path}\n\n")

            for root, dirs, files in os.walk(start_path):
                # Remove ignored folders from dirs list to prevent recursion into them
                dirs[:] = [d for d in dirs if d not in ignored_folders]

                # Calculate relative path for indentation
                level = root.replace(start_path, "").count(os.sep)
                indent = "  " * level

                # Write current directory
                folder_name = os.path.basename(root)
                f.write(f"{indent}📂 {folder_name}\n")

                # Write files in current directory
                sub_indent = "  " * (level + 1)
                for file in files:
                    full_path = os.path.join(root, file)
                    rel_path = os.path.relpath(full_path, start_path)
                    f.write(f"{sub_indent}📄 {rel_path}\n")

    except IOError as e:
        print(f"Error writing to file: {e}")


if __name__ == "__main__":
    # Get directory path from user or use current directory
    path = input(
        "Enter directory path (or press Enter for current directory): "
    ).strip()
    if not path:
        path = "."

    # Convert relative path to absolute path
    abs_path = os.path.abspath(path)
    output_file = "output.txt"

    print(f"\nScanning directory: {abs_path}")
    print(f"Results will be written to: {output_file}")

    list_directory_contents(abs_path, output_file)
    print("\nDone! Check output.txt for results.")
