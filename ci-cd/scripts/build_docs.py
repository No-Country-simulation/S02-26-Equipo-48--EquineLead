import os
import shutil

# Dynamic path to project root (two levels up from ci-cd/scripts)
script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(script_dir, "../../"))
staging_dir = os.path.join(root_dir, '.docs_build')

# Remove existing staging dir
if os.path.exists(staging_dir):
    shutil.rmtree(staging_dir)

os.makedirs(staging_dir)

items_to_copy = [
    'README.md',
    'infrastructure',
    'tests',
    'ci-cd',
    'src',
    'docs',
    'mkdocs.yml'
]

def ignore_files(dir, files):
    return [f for f in files if f in ['node_modules', 'venv', '.git', '__pycache__', 'site', 'target', 'bin', 'obj', '.next', 'dist', 'build', '.terraform']]

for item in items_to_copy:
    src_path = os.path.join(root_dir, item)
    dst_path = os.path.join(staging_dir, item)
    
    if os.path.isdir(src_path):
        shutil.copytree(src_path, dst_path, ignore=ignore_files)
    elif os.path.isfile(src_path):
        shutil.copy2(src_path, dst_path)

print(f"Successfully copied files to {staging_dir}")
