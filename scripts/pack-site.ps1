# PowerShell script to create a zip archive of the site files
# Usage: .\scripts\pack-site.ps1 -OutFile visil-site.zip
param(
  [string]$OutFile = 'visil-site.zip'
)

$root = Get-Location
Write-Host "Creating zip: $OutFile from $root"

# Files and folders to exclude
$exclude = @('node_modules','dist','.git','.venv')

# Build list of files to include
$items = Get-ChildItem -Recurse -File | Where-Object {
  foreach ($e in $exclude) { if ($_.FullName -like "*\\$e*") { return $false } }
  return $true
}

if (Test-Path $OutFile) { Remove-Item $OutFile }

# Create the archive
Compress-Archive -Path $items -DestinationPath $OutFile -Force
Write-Host "Archive created: $OutFile"
