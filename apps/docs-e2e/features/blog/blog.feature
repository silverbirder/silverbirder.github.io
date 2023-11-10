Feature: Blog

    Scenario Outline: Viewing a Blog Post
        Given Alice is on the blog list page
        When Alice selects first blog post
        Then Alice should see the selected blog post
