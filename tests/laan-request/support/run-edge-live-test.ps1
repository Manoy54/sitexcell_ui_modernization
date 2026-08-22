$ErrorActionPreference = 'Stop'

$activePortFile = Join-Path $env:LOCALAPPDATA `
    'Microsoft\Edge\User Data\DevToolsActivePort'

if (-not (Test-Path -LiteralPath $activePortFile)) {
    throw @"
Edge remote debugging metadata was not found.
Open edge://inspect/#remote-debugging in the Default profile and enable
'Allow remote debugging for this browser instance', then try again.
"@
}

$endpointMetadata = @(Get-Content -LiteralPath $activePortFile)

if ($endpointMetadata.Count -lt 2) {
    throw "Edge's DevToolsActivePort file does not contain a WebSocket path."
}

$cdpPort = $endpointMetadata[0].Trim()
$webSocketPath = $endpointMetadata[1].Trim()
$env:EDGE_CDP_ENDPOINT = "ws://127.0.0.1:$cdpPort$webSocketPath"

Write-Host "Connecting Playwright to $env:EDGE_CDP_ENDPOINT"
npm.cmd run test:laan:live

if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}
