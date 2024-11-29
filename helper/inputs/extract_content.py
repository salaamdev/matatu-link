import os

EXCLUDED_FOLDERS = {
    "node_modules",
    ".git",
    "helper",
    # "assets",
    ".expo",
    "__tests__",
}
EXCLUDED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".svg",
    ".gif",
    # ".db",
    # ".md",
    # ".json",
    # ".sqlite",
    ".PDF",
    ".pdf",
    ".css",
}
EXCLUDED_FILES = {
    # ".gitignore",
    "EXPORT_IMPORT.md",
    "PEER_ERROR.md",
    "QUERIES.md",
    "POPULATINGDB.md",
    "README.md",
    "package-lock.json",
    "test.json",
    "dbtest.json",
}


def write_file_paths_and_content(root_directory, output_file):
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as out_file:
        for foldername, subfolders, filenames in os.walk(root_directory):
            # Remove excluded folders from traversal
            subfolders[:] = [d for d in subfolders if d not in EXCLUDED_FOLDERS]
            for filename in filenames:
                file_path = os.path.join(foldername, filename)
                # Skip files with excluded extensions or specific excluded files
                if (
                    any(filename.endswith(ext) for ext in EXCLUDED_EXTENSIONS)
                    or filename in EXCLUDED_FILES
                ):
                    continue
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        file_content = f.read()
                except Exception as e:
                    file_content = f"Could not read file: {e}"
                out_file.write(f"{file_path}\n")
                out_file.write(
                    """
```
"""
                )
                out_file.write(file_content)
                out_file.write(
                    """
```
"""
                )
                out_file.write("\n\n")


if __name__ == "__main__":
    # For backend folder
    backend_root_directory = r"C:\Users\abdis\Documents\projects\personal\matatu-link"
    backend_output_file = r"../outputs/content.txt"
    write_file_paths_and_content(backend_root_directory, backend_output_file)
    print(f"File paths and contents written to {backend_output_file}")

    # For frontend folder
    # frontend_root_directory = r"../../../matatu-link/frontend"
    # frontend_output_file = r"../outputs/frontend_content.txt"
    # write_file_paths_and_content(frontend_root_directory, frontend_output_file)
    # print(f"File paths and contents written to {frontend_output_file}")
