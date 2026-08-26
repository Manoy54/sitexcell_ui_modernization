param(
    [switch]$RefreshSession,
    [switch]$ShowBrowser,
    [int]$SlowMo = 250,
    [string]$TestFile
)

$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..\..\..')).Path
Set-Location -LiteralPath $projectRoot

$runContext = & node.exe 'tests/access-requests/support/create-run-context.mjs' | ConvertFrom-Json
$env:ACCESS_RUN_ID = $runContext.identifier
$env:ACCESS_RUN_STARTED_AT = [DateTimeOffset]::Now.ToString('o')
$env:ACCESS_COMMIT = (& git.exe rev-parse HEAD).Trim()
Write-Host "Run ID: $($env:ACCESS_RUN_ID)"

$storageStatePath = Join-Path $projectRoot '.auth\access-request-storage-state.json'
$useCdpSession = -not [string]::IsNullOrWhiteSpace($env:EDGE_CDP_ENDPOINT)

if (-not $useCdpSession -and ($RefreshSession -or -not (Test-Path -LiteralPath $storageStatePath))) {
    & node.exe 'tests/access-requests/support/create-storage-state.mjs'
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

if (-not $useCdpSession -and -not (Test-Path -LiteralPath $storageStatePath)) {
    throw "Authenticated Access Request session was not found: $storageStatePath"
}

if (-not $useCdpSession) {
    $env:ACCESS_STORAGE_STATE = (Resolve-Path -LiteralPath $storageStatePath).Path
}
$env:ACCESS_HEADED = if ($ShowBrowser) { 'true' } else { 'false' }
$env:ACCESS_SLOW_MO = if ($ShowBrowser) { [string]$SlowMo } else { '0' }

$arguments = @(
    'playwright',
    'test',
    '--config=tests/access-requests/configs/playwright.live.config.js'
)
if (-not [string]::IsNullOrWhiteSpace($TestFile)) { $arguments += $TestFile }

& npx.cmd @arguments
exit $LASTEXITCODE
