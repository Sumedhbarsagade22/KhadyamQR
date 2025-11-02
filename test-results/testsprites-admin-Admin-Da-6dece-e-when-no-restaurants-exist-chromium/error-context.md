# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e5]:
    - generic [ref=e6]:
      - img "KhadyamQR" [ref=e7]
      - heading "KhadyamQR Admin" [level=1] [ref=e8]
    - generic [ref=e9]: Invalid login credentials
    - generic [ref=e10]:
      - generic [ref=e11]:
        - generic [ref=e12]: Email
        - textbox "admin@example.com" [ref=e13]: sbarsgadae.s22@gmail.com
      - generic [ref=e14]:
        - generic [ref=e15]: Password
        - generic [ref=e16]:
          - textbox "••••••••" [active] [ref=e17]: Sumedhk
          - button "Show" [ref=e18] [cursor=pointer]
      - button "Sign In" [ref=e19] [cursor=pointer]
      - generic [ref=e20]:
        - paragraph [ref=e21]:
          - text: Forgot password?
          - link "Contact Admin" [ref=e22] [cursor=pointer]:
            - /url: mailto:admin@khadyamqr.com?subject=Password Reset Request
        - link "← Back to Home" [ref=e23] [cursor=pointer]:
          - /url: /
    - paragraph [ref=e24]: Admin access only. Contact your administrator for credentials.
```