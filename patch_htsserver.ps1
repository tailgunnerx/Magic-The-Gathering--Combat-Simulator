$file = '..\httrack-v2-master\src\htsserver.c'
$content = Get-Content $file -Raw

if ($content -notmatch '#include "htsapi.h"') {
    $content = $content -replace '(#include "htsserver.h")', "`$1`n#include ""htsapi.h"""
    Set-Content $file -Value $content -NoNewline
    Write-Host "Added htsapi.h include"
}

$apiCheckCode = @'
      /* API routing - check if this is an API request */
      if (meth && line1[0] != '\0') {
        char request_path[512];
        char *path_start = line1;
        char *path_end;
        char *query_start = NULL;
        const char *http_method = "";
        
        /* Skip method name */
        while (*path_start && *path_start != ' ') path_start++;
        while (*path_start == ' ') path_start++;
        
        /* Find end of path (space or ?) */
        path_end = path_start;
        while (*path_end && *path_end != ' ' && *path_end != '?') path_end++;
        
        /* Check for query string */
        if (*path_end == '?') {
          query_start = path_end + 1;
          /* Find end of query */
          while (*path_end && *path_end != ' ') path_end++;
        }
        
        /* Extract path */
        {
          int path_len = path_end - path_start;
          if (path_len >= sizeof(request_path)) path_len = sizeof(request_path) - 1;
          memcpy(request_path, path_start, path_len);
          request_path[path_len] = '\0';
        }
        
        /* Check if this is an API request */
        if (strncmp(request_path, "/api/", 5) == 0) {
          /* Determine HTTP method */
          if (meth == 1) http_method = "GET";
          else if (meth == 2) http_method = "POST";
          else if (meth == 10) http_method = "HEAD";
          
          /* Route to API handler */
          if (hts_api_route(soc_c, http_method, request_path, 
                           query_start ? query_start : "", 
                           buffer)) {
            /* API request handled, skip template processing */
            goto api_request_handled;
          }
        }
      }

'@

if ($content -notmatch '/\* API routing') {
    $content = $content -replace '(\s+if \(meth == 2\) \{[\s\S]+?\}\s+\})', "`$1`n$apiCheckCode"
    Set-Content $file -Value $content -NoNewline
    Write-Host "Added API routing code"
}

$labelCode = @'

api_request_handled:
  ;
'@

if ($content -notmatch 'api_request_handled:') {
    $content = Get-Content $file -Raw
    $content = $content -replace '(\s+return retour;\s+\})', "$labelCode`n`$1"
    Set-Content $file -Value $content -NoNewline
    Write-Host "Added API label"
}
