Write-Host "This is a test script" -ForegroundColor Green
Write-Host "Current directory: $(Get-Location)"
Write-Host "DATABASE_URL exists: $([bool]$env:DATABASE_URL)"
Write-Host "PowerShell version: $($PSVersionTable.PSVersion)"
