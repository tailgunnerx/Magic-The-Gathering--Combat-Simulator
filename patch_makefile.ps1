$file = '..\httrack-v2-master\src\Makefile.am'
$content = Get-Content $file -Raw

$oldLine = 'htsserver_SOURCES = htsserver.c htsserver.h htsweb.c htsweb.h'
$newLine = 'htsserver_SOURCES = htsserver.c htsserver.h htsweb.c htsweb.h htsjson.c htsjson.h htsapi.c htsapi.h'

if ($content -match [regex]::Escape($oldLine)) {
    $content = $content -replace [regex]::Escape($oldLine), $newLine
    Set-Content $file -Value $content -NoNewline
    Write-Host "Updated htsserver_SOURCES in Makefile.am"
} else {
    Write-Host "Pattern not found or already updated"
}
