Feature: 多言語対応

    Scenario: 日本語から英語に切り替える
        Given ユーザー "Alice" は日本のトップページを開いている
        When "Alice" は英語に切り替える
        Then "Alice" は英語のBackgroundの文字が見える