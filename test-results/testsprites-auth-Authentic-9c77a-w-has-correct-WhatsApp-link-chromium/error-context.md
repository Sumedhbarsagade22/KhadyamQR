# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e5]:
    - generic [ref=e6]:
      - img "KhadyamQR" [ref=e7]
      - generic [ref=e8]:
        - heading "Restaurant Login" [level=1] [ref=e9]
        - paragraph [ref=e10]: Manage your menu
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]: Email
        - textbox "restaurant@example.com" [ref=e14]
      - generic [ref=e15]:
        - generic [ref=e16]: Password
        - generic [ref=e17]:
          - textbox "••••••••" [ref=e18]
          - button "👁️‍🗨️" [ref=e19] [cursor=pointer]
      - button "Sign In" [ref=e20] [cursor=pointer]
    - generic [ref=e21]:
      - generic [ref=e22]:
        - paragraph [ref=e23]:
          - text: Forgot password?
          - link "Contact Admin" [active] [ref=e24] [cursor=pointer]:
            - /url: https://wa.me/918830778401?text=Hello%20Admin%2C%20I%20need%20to%20reset%20my%20restaurant%20account%20password.%20My%20email%20is%3A%20
        - link "← Back to Home" [ref=e25] [cursor=pointer]:
          - /url: /
      - generic [ref=e26]:
        - paragraph [ref=e27]: Don't have an account?
        - link "Contact Us" [ref=e28] [cursor=pointer]:
          - /url: /contact
```