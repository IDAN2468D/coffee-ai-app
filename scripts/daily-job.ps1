
Set-Location "c:\Users\Lenovo\Desktop\App\coffee-ai-app"
Write-Host "Starting Daily Product Generation..."
$env:PATH += ";C:\Program Files\nodejs" 
# Ensure node/npx is in path, though usually it is.

npx tsx scripts/generate-daily-products.ts

Write-Host "Done."
