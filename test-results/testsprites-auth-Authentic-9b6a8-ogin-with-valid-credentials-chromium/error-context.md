# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - generic [ref=e7]:
          - heading "restaurant" [level=1] [ref=e8]
          - paragraph [ref=e9]: Restaurant Dashboard
        - generic [ref=e10]:
          - link "👁️ View Menu" [ref=e11] [cursor=pointer]:
            - /url: /menu/restaurant
          - button "Sign Out" [ref=e12] [cursor=pointer]
    - main [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]:
          - generic [ref=e16]: "0"
          - generic [ref=e17]: Total Items
        - generic [ref=e18]:
          - generic [ref=e19]: "0"
          - generic [ref=e20]: Available
        - generic [ref=e21]:
          - generic [ref=e22]: "0"
          - generic [ref=e23]: Unavailable
        - generic [ref=e24]:
          - generic [ref=e25]: "0"
          - generic [ref=e26]: Categories
      - generic [ref=e27]:
        - generic [ref=e28]:
          - heading "Menu Items (0)" [level=2] [ref=e29]
          - generic [ref=e30]:
            - textbox "Search items..." [ref=e31]
            - button "+ Add Item" [ref=e32] [cursor=pointer]
        - paragraph [ref=e35]: No menu items yet. Add your first item!
```