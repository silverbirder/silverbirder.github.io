Feature: Internationalization

  Scenario Outline: Language Change

    Given Alice is on the homepage in the <language> language
    When Alice selects <change_language> from the language menu
    Then The page is displayed to her in the <change_language>

    Examples:
      | language | change_language |
      | English  | Japanese        |
      | Japanese | English         |

