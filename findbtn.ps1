$files = Get-ChildItem -Recurse -Include "*.tsx","*.css" | Where-Object { $_.FullName -notmatch "node_modules|\.next" }
foreach ($file in $files) {
    $lines = Get-Content $file.FullName
    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]
        if ($line -match "bg-\[#" -and ($line -match "<button" -or $line -match "<Link" -or $line -match "className=")) {
            Write-Host ($file.Name + ":" + ($i+1) + ": " + $line.Trim())
        }
    }
}
