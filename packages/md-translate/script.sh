#!/bin/bash

# カレントディレクトリから index.mdx ファイルを検索
for file in $(find . -type f -name 'index.mdx'); do
    if [ -f "$file" ]; then # ファイルが存在するかチェック
        echo "Processing $file..."
        chatgpt-md-translator "$file"
    else
        echo "File $file not found!"
    fi
done