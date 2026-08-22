param(
    [switch]$RefreshSession,
    [switch]$NoReport,
    [switch]$ShowBrowser,
    [int]$SlowMo = 250,
    [string]$TestFile,
    [string]$ConfigFile = 'tests/laan-request/configs/playwright.live.config.js'
)

$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..\..\..')).Path
Set-Location -LiteralPath $projectRoot

$runStartedAt = [DateTimeOffset]::Now
$runId = 'LAN-' + $runStartedAt.ToString('yyyyMMdd-HHmmss-fff')
$env:LAN_RUN_ID = $runId
$env:LAN_RUN_STARTED_AT = $runStartedAt.ToString('o')

Write-Host "Run ID: $runId"
Write-Host "Run started: $($runStartedAt.ToString('yyyy-MM-dd HH:mm:ss zzz'))"

$storageStatePath = Join-Path $projectRoot '.auth\storage-state.json'
$useCdpSession = -not [string]::IsNullOrWhiteSpace($env:EDGE_CDP_ENDPOINT)

if (-not $useCdpSession -and ($RefreshSession -or -not (Test-Path -LiteralPath $storageStatePath))) {
    Write-Host 'No usable local session file was selected. Starting authenticated session setup...'
    & npm.cmd run session:setup

    if ($LASTEXITCODE -ne 0) {
        exit $LASTEXITCODE
    }
}

if (-not $useCdpSession -and -not (Test-Path -LiteralPath $storageStatePath)) {
    throw "Authenticated session file was not found: $storageStatePath"
}

if (-not $useCdpSession) {
    $env:EDGE_STORAGE_STATE = (Resolve-Path -LiteralPath $storageStatePath).Path
    Write-Host "Using authenticated session: $env:EDGE_STORAGE_STATE"
} else {
    Write-Host "Using authenticated Edge CDP session: $env:EDGE_CDP_ENDPOINT"
}
$env:LAN_HEADED = if ($ShowBrowser) { 'true' } else { 'false' }
$env:LAN_SLOW_MO = if ($ShowBrowser) { [string]$SlowMo } else { '0' }
New-Item -ItemType Directory -Path (Join-Path $projectRoot '.test-artifacts\playwright\history') -Force | Out-Null

if ($ShowBrowser) {
    Write-Host "Visible browser mode enabled (slow motion: ${SlowMo}ms)."
}

Write-Host "Playwright config: $ConfigFile"
$playwrightArguments = @('playwright', 'test', "--config=$ConfigFile")

if (-not [string]::IsNullOrWhiteSpace($TestFile)) {
    Write-Host "Focused test file: $TestFile"
    $playwrightArguments += $TestFile
}

& npx.cmd @playwrightArguments
$testExitCode = $LASTEXITCODE

$runFinishedAt = [DateTimeOffset]::Now
$reportPath = Join-Path $projectRoot '.test-artifacts\playwright\live-results.json'
$historyDirectory = Join-Path $projectRoot '.test-artifacts\playwright\history'

if (Test-Path -LiteralPath $reportPath) {
    New-Item -ItemType Directory -Path $historyDirectory -Force | Out-Null
    Copy-Item -LiteralPath $reportPath -Destination (Join-Path $historyDirectory "$runId.json") -Force
    Write-Host "Archived report: .test-artifacts\playwright\history\$runId.json"
}

Write-Host "Run finished: $($runFinishedAt.ToString('yyyy-MM-dd HH:mm:ss zzz'))"
Write-Host "Run status: $(if ($testExitCode -eq 0) { 'PASSED' } else { 'FAILED' })"

if (-not $NoReport) {
    $reportScript = Join-Path $projectRoot 'tests\laan-request\support\results-server.mjs'
    $reportPort = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue

    if (-not $reportPort) {
        $quotedReportScript = '"' + $reportScript + '"'
        Start-Process -FilePath 'node.exe' `
            -ArgumentList @($quotedReportScript) `
            -WorkingDirectory $projectRoot `
            -WindowStyle Hidden | Out-Null
    }

    Write-Host ''
    Write-Host 'Results dashboard: http://127.0.0.1:4173/'
}

exit $testExitCode
