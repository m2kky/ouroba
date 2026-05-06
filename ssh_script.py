import paramiko
import sys

host = 'oroubafoods.com'
user = 'orouba5'
password = 'Or0ub#F21002100'

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
try:
    client.connect(host, port=2222, username=user, password=password)
except Exception as e:
    print(f"Connection failed: {e}")
    sys.exit(1)

print("Connected successfully. Finding Laravel project...")
stdin, stdout, stderr = client.exec_command('find ~ -name artisan 2>/dev/null')
laravel_paths = [p for p in stdout.read().decode().strip().split('\n') if p]

print("Laravel paths found:")
print(laravel_paths)

if laravel_paths:
    dir_path = laravel_paths[0].replace('/artisan', '')
    print(f"\nListing files in {dir_path}:")
    stdin, stdout, stderr = client.exec_command(f'ls -la {dir_path}')
    print(stdout.read().decode())
else:
    print("\nListing ~/public_html:")
    stdin, stdout, stderr = client.exec_command('ls -la ~/public_html')
    print(stdout.read().decode())

client.close()
