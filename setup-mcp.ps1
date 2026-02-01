$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"
$mcpPath = "C:/Users/Lenovo/Desktop/App/coffee-ai-app/mcp-server/dist/index.js"
$dbUrl = "mongodb+srv://idankzm:idankzm2468@cluster0.purdk.mongodb.net/coffee_shop?retryWrites=true&w=majority"

$newConfig = @{
    mcpServers = @{
        "coffee-explorer" = @{
            command = "node"
            args    = @($mcpPath)
            env     = @{
                DATABASE_URL = $dbUrl
            }
        }
    }
}

# Create directory if it doesn't exist
$configDir = [System.IO.Path]::GetDirectoryName($configPath)
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir -Force
}

# If config file exists, merge with existing config
if (Test-Path $configPath) {
    $existingConfig = Get-Content $configPath | ConvertFrom-Json
    if ($null -eq $existingConfig.mcpServers) {
        $existingConfig | Add-Member -MemberType NoteProperty -Name "mcpServers" -Value @{}
    }
    $existingConfig.mcpServers."coffee-explorer" = $newConfig.mcpServers."coffee-explorer"
    $outputConfig = $existingConfig
}
else {
    $outputConfig = $newConfig
}

# Save the config
$outputConfig | ConvertTo-Json -Depth 10 | Set-Content $configPath -Encoding UTF8

Write-Host "✅ MCP Server 'coffee-explorer' has been added to Claude Desktop config!" -ForegroundColor Green
Write-Host "📍 Config location: $configPath" -ForegroundColor Cyan
Write-Host "⚠️ Please RESTART Claude Desktop to apply changes." -ForegroundColor Yellow
