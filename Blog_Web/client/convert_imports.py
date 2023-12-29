import re
import os

def convert_imports(code):
  """Converts all imports in the given code to use the `~` alias."""

  # Create a regular expression to match import statements.
  import_regex = re.compile(r'import\s+(?P<module>\w+)\s+from\s+(?P<path>[\'\"][^\'\"\\\\]+[\'\"])')

  # Iterate over all import statements in the code.
  for match in import_regex.finditer(code):
    # Get the module name and path from the match.
    module = match.group('module')
    path = match.group('path')

    # If the path starts with `./`, replace it with `~`.
    if path.startswith('./'):
      path = path.replace('./', '~')

    # Replace the import statement with a new import statement that uses the `~` alias.
    code = code.replace(match.group(), f'import {module} from {path}')

  return code

# Get the current working directory.
cwd = os.getcwd()

# Iterate over all files in the current working directory.
for filename in os.listdir(cwd):
  # If the file is a Python file, open it and read the contents.
  if filename.endswith('.py'):
    with open(filename, 'r') as f:
      code = f.read()

    # Convert the import statements in the code to relative imports.
    converted_code = convert_imports(code)

    # Write the converted code back to the file.
    with open(filename, 'w') as f:
      f.write(converted_code)

