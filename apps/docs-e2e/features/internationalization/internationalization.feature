Feature: Internationalization

  Scenario Outline: Language Change

    Given Alice navigates to the homepage in the <language> language
    When Alice selects <change_language> from the language menu
    Then the page is displayed to Alice in the <change_language>

    Examples:
      | language | change_language |
      | English  | Japanese        |
      | Japanese | English         |

