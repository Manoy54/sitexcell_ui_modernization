param(
    [switch]$RefreshSession,
    [switch]$NoReport,
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
New-Item -ItemType Directory -Path (Join-Path $projectRoot '.test-artifacts\playwright\history') -Force | Out-Null

$arguments = @(
    'playwright',
    'test',
    '--config=tests/access-requests/configs/playwright.live.config.js'
)
if (-not [string]::IsNullOrWhiteSpace($TestFile)) { $arguments += $TestFile }

& npx.cmd @arguments
$testExitCode = $LASTEXITCODE

$reportPath = Join-Path $projectRoot '.test-artifacts\playwright\access-request-core-results.json'
$historyDirectory = Join-Path $projectRoot '.test-artifacts\playwright\history'
if (Test-Path -LiteralPath $reportPath) {
    Copy-Item -LiteralPath $reportPath -Destination (Join-Path $historyDirectory "$($runContext.identifier).json") -Force
    Write-Host "Archived report: .test-artifacts/playwright/history/$($runContext.identifier).json"
}

if (-not $NoReport) {
    $reportScript = Join-Path $projectRoot 'tests\laan-request\support\results-server.mjs'
    $reportPort = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
    if (-not $reportPort) {
        $quotedReportScript = '"' + $reportScript + '"'
        Start-Process -FilePath 'node.exe' -ArgumentList @($quotedReportScript) -WorkingDirectory $projectRoot -WindowStyle Hidden | Out-Null
    }
    Write-Host ''
    Write-Host 'Results dashboard: http://127.0.0.1:4173/?suite=access&section=results'
}

exit $testExitCode
