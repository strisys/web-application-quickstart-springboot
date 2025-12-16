Write-Host "------ Stopping Docker Environment ------" -ForegroundColor Cyan

# Ask whether to remove volumes — default is YES
$removeVolumes = Read-Host "Containers and volumes will be removed. Enter N to keep volumes (Y=default)"

if ($removeVolumes -eq "n" -or $removeVolumes -eq "N") {
    Write-Host "Stopping containers only (volumes kept)..." -ForegroundColor Yellow
    docker compose down
} else {
    Write-Host "Stopping containers and removing volumes..." -ForegroundColor Yellow
    docker compose down -v
}

Write-Host "`nDone ?" -ForegroundColor Green
pause
