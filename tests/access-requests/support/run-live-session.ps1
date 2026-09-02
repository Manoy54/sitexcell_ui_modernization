param(
    [switch]$RefreshSession,
    [switch]$NoReport,
    [switch]$ShowBrowser,
    [int]$SlowMo = 250,
    [string]$TestFile,
    [string]$Grep,
    [string]$ConfigFile = 'tests/access-requests/configs/playwright.access-request.config.js',
    [string]$ReportFile = 'access-request-results.json',
    [string]$SuiteLabel = 'access-request',
    [int]$PlannedCaseCount = 34
)

$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) '..\..\..')).Path
Set-Location -LiteralPath $projectRoot

$runContext = & node.exe 'tests/access-requests/support/create-run-context.mjs' | ConvertFrom-Json
$env:ACCESS_RUN_ID = $runContext.identifier
$env:ACCESS_RUN_STARTED_AT = [DateTimeOffset]::Now.ToString('o')
$env:ACCESS_COMMIT = (& git.exe rev-parse HEAD).Trim()
$env:ACCESS_CONFIG_FILE = $ConfigFile
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
$reportDirectory = Join-Path $projectRoot '.test-artifacts\playwright'
$isFocusedRun = (-not [string]::IsNullOrWhiteSpace($TestFile)) -or (-not [string]::IsNullOrWhiteSpace($Grep))
if ($isFocusedRun) {
    $ReportFile = "access-request-$SuiteLabel-focused-results.json"
}
$reportPath = Join-Path $reportDirectory $ReportFile
$env:ACCESS_REPORT_PATH = $reportPath

$arguments = @(
    'playwright',
    'test',
    "--config=$ConfigFile"
)
if (-not [string]::IsNullOrWhiteSpace($TestFile)) { $arguments += $TestFile }
if (-not [string]::IsNullOrWhiteSpace($Grep)) { $arguments += "--grep=$Grep" }

& npx.cmd @arguments
$testExitCode = $LASTEXITCODE

$historyDirectory = Join-Path $projectRoot '.test-artifacts\playwright\history'
if (Test-Path -LiteralPath $reportPath) {
    $historyName = "$($runContext.identifier)-$SuiteLabel.json"
    Copy-Item -LiteralPath $reportPath -Destination (Join-Path $historyDirectory $historyName) -Force
    Write-Host "Archived report: .test-artifacts/playwright/history/$historyName"

    $consolidateArguments = @(
        'tests/access-requests/support/consolidate-results.mjs',
        "--report=$reportPath",
        "--planned-cases=$PlannedCaseCount"
    )
    if ($isFocusedRun) {
        $focusedOutput = Join-Path $reportDirectory "access-request-$SuiteLabel-focused-consolidated.json"
        $consolidateArguments += "--local-output=$focusedOutput"
        $consolidateArguments += "--committed-output=$focusedOutput"
    }
    & node.exe @consolidateArguments
    if ($LASTEXITCODE -ne 0 -and $testExitCode -eq 0) { $testExitCode = $LASTEXITCODE }
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
