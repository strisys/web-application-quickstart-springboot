Write-Host "------ Local Deployment ------" -ForegroundColor Cyan

$profile = Read-Host "Enter Spring profile (local, dev, prod, etc.)"

if ([string]::IsNullOrWhiteSpace($profile)) {
    Write-Host "No profile entered. Defaulting to 'default'."
    $profile = "default"
}

# Export env variable for docker compose
$env:SPRING_PROFILES_ACTIVE = $profile
Write-Host "Using SPRING_PROFILES_ACTIVE = $profile"

# Remove previous environment by default
$removeVolumes = Read-Host "Containers and volumes will be removed. Enter N to keep volumes (Y=default)"

if ($removeVolumes -eq "n" -or $removeVolumes -eq "N") {
    Write-Host "Stopping containers only (volumes kept)..." -ForegroundColor Yellow
    docker compose down
} else {
    Write-Host "Stopping containers and removing volumes..." -ForegroundColor Yellow
    docker compose down -v
}

# Optionally rebuild images
$rebuild = Read-Host "Rebuild images? (y/N)"

if ($rebuild -eq "y" -or $rebuild -eq "Y") {
    Write-Host "Rebuilding images..." -ForegroundColor Yellow
    docker compose build
}

Write-Host "Starting containers..." -ForegroundColor Yellow
docker compose up -d

Write-Host "`nDeployment complete!" -ForegroundColor Green
docker compose ps

# Prompt to open browser
$openBrowser = Read-Host "`nOpen application in browser? (y/N)"
if ($openBrowser -eq "y" -or $openBrowser -eq "Y") {
    Write-Host "Opening browser..."
    Start-Process "http://localhost:8080"
}

# Ask if logs should be tailed
$logs = Read-Host "`nTail live logs? (y/N)"

if ($logs -eq "y" -or $logs -eq "Y") {
    Write-Host "`n--- Streaming logs (Ctrl+C to exit) ---`n" -ForegroundColor Cyan
    docker compose logs -f
}

# Option #3: Clean dangling images (and optionally build cache)
$cleanImages = Read-Host "`nClean dangling images? (y/N)"

if ($cleanImages -eq "y" -or $cleanImages -eq "Y") {
    Write-Host "Pruning dangling images..." -ForegroundColor Yellow
    docker image prune -f

    $cleanBuilder = Read-Host "Also prune Docker build cache? (y/N)"
    
    if ($cleanBuilder -eq "y" -or $cleanBuilder -eq "Y") {
        Write-Host "Pruning Docker builder cache..." -ForegroundColor Yellow
        docker builder prune -f
    }
}

pause
