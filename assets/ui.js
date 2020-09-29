const filled_love = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13.35 20.13c-.76.69-1.93.69-2.69-.01l-.11-.1C5.3 15.27 1.87 12.16 2 8.28c.06-1.7.93-3.33 2.34-4.29 2.64-1.8 5.9-.96 7.66 1.1 1.76-2.06 5.02-2.91 7.66-1.1 1.41.96 2.28 2.59 2.34 4.29.14 3.88-3.3 6.99-8.55 11.76l-.1.09z"/></svg>`
const outlined_love = `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19.66 3.99c-2.64-1.8-5.9-.96-7.66 1.1-1.76-2.06-5.02-2.91-7.66-1.1-1.4.96-2.28 2.58-2.34 4.29-.14 3.88 3.3 6.99 8.55 11.76l.1.09c.76.69 1.93.69 2.69-.01l.11-.1c5.25-4.76 8.68-7.87 8.55-11.75-.06-1.7-.94-3.32-2.34-4.28zM12.1 18.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`
const home = `<svg xmlns="http://www.w3.org/2000/svg" height="23" viewBox="0 0 24 15" width="21">
  <path d="M0 0h24v24H0V0z" fill="none" />
  <path
    d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
  </svg>`

const expand_less = `
<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M0 0h24v24H0V0z" fill="none" />
  <path
    d="M11.29 8.71L6.7 13.3c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 10.83l3.88 3.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L12.7 8.71c-.38-.39-1.02-.39-1.41 0z" />
</svg>
`
const x_button = `<svg xmlns = "http://www.w3.org/2000/svg" viewBox = "0 0 24 24" fill = "white" width = "18px" height = "18px" > <path d="M0 0h24v24H0V0z" fill="none" /><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" /></svg>`
const ui = `
<fready>
  <fready-block class='fready_div' id='fready_ui'>
    <a href='${FREADY_API}' target="_blank"><fready-icon id="fready_home">${home}</fready-icon></a>
    <fready-button class='x-fready-button x-fready-inline x-fready-ghost' id='savethisfready'>SAVE</fready-button>
    <fready-button class='x-fready-button x-fready-inline' id='readthisfready'>READ</fready-button>
    <a href='${FREADY_API}' id='loggedinlink' target="_blank"><fready-p class="x-fready-meta"> Logged into Fready: <strong id='username'> _ </strong></fready-p></a>
    <a href='${FREADY_API}/users/sign_in' id='loggedoutlink' style='display:none;' target="_blank"><br><fready-p class="x-fready-meta"> <strong id='username'> LOG IN | SIGN UP </strong></fready-p></a>
    <fready-div class='freadyhide' id='freadyhidebutton'> ${expand_less} </fready-div>
    <fready-div class='freadyhide' id='freadyhidebigbutton'></fready-div>
  </fready-block>
</fready>
`
const fready_logo = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 28 37" xmlns="http://www.w3.org/2000/svg">
<path d="m24.671 24.925-8.3084-19.199c-0.0079 0.13416-0.04 0.26579-0.0948 0.3885-0.1068 0.22303-0.2935 0.39774-0.5231 0.48946-0.0031 0.03255-0.0031 0.06533 0 0.09789l0.0703 0.13154c0.2081 0 1.291 0.27531 0.9759 0.7097-0.1224 0.17131-0.517 0.22943-0.6944 0.2539-0.3765 0.03421-0.7557 0.02085-1.1288-0.03977-0.7107-0.03802-1.3877-0.31507-1.9211-0.78618-0.1483-0.18483-0.2292-0.41463-0.2295-0.65158l-11.747 24.693c-0.05392 0.1167-0.084269 0.2428-0.089302 0.3713-0.005034 0.1284 0.015347 0.2565 0.059972 0.377 0.04463 0.1206 0.11262 0.2311 0.20007 0.3252 0.08745 0.0942 0.19264 0.1702 0.30954 0.2236 0.20443 0.099 0.43694 0.1239 0.6577 0.0703l21.833-6.1303c0.2461-0.0726 0.4539-0.2389 0.5787-0.4632 0.1247-0.2243 0.1564-0.4886 0.0881-0.736-0.0089-0.0427-0.0212-0.0846-0.0367-0.1254z" fill="#EFEEEE"/>
<path d="m25.571 24.536-8.3085-19.272c-0.0255 0.03515-0.0553 0.06701-0.0887 0.09483-0.2331 0.14996-0.5004 0.23836-0.777 0.25697 0.0067 0.16797-0.0247 0.33528-0.0917 0.48945-0.1085 0.22178-0.2947 0.39598-0.5231 0.48945-0.0062 0.03234-0.0062 0.06554 0 0.09789l0.0673 0.13154c0.211 0 1.2909 0.27225 0.9758 0.7097-0.1193 0.17131-0.517 0.22943-0.6914 0.2539-0.3764 0.03267-0.7555 0.01931-1.1288-0.03976-0.7098-0.03404-1.3871-0.30798-1.921-0.77701-0.1049-0.13785-0.1793-0.29639-0.2183-0.46514-0.0391-0.16875-0.0418-0.34387-0.0081-0.51376-0.0775-0.09967-0.1309-0.21587-0.156-0.33956-0.1852-0.04178-0.3642-0.1076-0.5323-0.19578l-11.979 25.133c-0.16122 0.3388-0.22154 0.7168-0.17376 1.0889 0.047783 0.3722 0.20165 0.7227 0.44323 1.0097 0.24158 0.2871 0.56067 0.4986 0.91917 0.6092s0.74126 0.1158 1.1026 0.0148l21.823-6.1182c0.248-0.0691 0.4799-0.1866 0.6823-0.3457 0.2025-0.159 0.3715-0.3565 0.4974-0.581 0.1259-0.2246 0.2063-0.4718 0.2364-0.7275s0.0094-0.5148-0.0609-0.7624c-0.0246-0.0823-0.0542-0.163-0.0887-0.2417z" fill="#232323"/>
<path d="m15.05 7.7629h-0.0581c-0.5373-0.05991-1.0572-0.2263-1.5295-0.48945-3.9217 8.0209-7.3418 16.088-11.505 24.133 7.3418-1.9241 14.313-3.8269 21.82-6.1181l-8.7276-17.525z" fill="#232323"/>
<path d="m16.195 7.7773c2.5023 5.9071 5.0536 11.698 7.5804 17.535l-7.5804-17.535z" fill="#232323"/>
<path d="m24.95 24.775-8.544-18.458c-0.1228 0.03577-0.2488 0.05934-0.3762 0.07036h-0.2631c-0.0233 0.10064-0.0233 0.20527 0 0.30591l0.0673 0.13154c0.2111 0 1.2909 0.27226 0.9789 0.70664-0.1224 0.17131-0.52 0.23249-0.6944 0.25697-0.377 0.02862-0.7561 0.01115-1.1288-0.05201-0.7116-0.03901-1.3889-0.31834-1.9211-0.7923-0.1044-0.1463-0.1778-0.3124-0.2157-0.4881-0.0379-0.17571-0.0394-0.3573-0.0046-0.53362l-11.606 24.378c-0.07908 0.1676-0.10896 0.3542-0.08617 0.5381s0.09731 0.3576 0.2149 0.5008 0.27342 0.2501 0.44937 0.3083c0.17595 0.0581 0.36479 0.0651 0.54458 0.0202l21.933-5.5461c0.0586-0.0148 0.1159-0.0342 0.1713-0.0581 0.236-0.1057 0.4204-0.3006 0.5127-0.5421 0.0923-0.2414 0.0851-0.5097-0.0201-0.7458h-0.0123z" fill="#EFEEEE"/>
<path d="m21.934 21.314c0.3671-0.4253 0.7434-0.8596 1.138-1.2818l-5.6929-17.675c-0.041-0.12232-0.1059-0.2353-0.1908-0.33239-0.085-0.0971-0.1883-0.17639-0.3041-0.23328-0.1158-0.0569-0.2417-0.09027-0.3705-0.09819-0.1287-0.00792-0.2578 0.00977-0.3797 0.05204-0.206 0.07133-0.3818 0.21045-0.4986 0.39462l-10.707 17.782c0 1.3949-0.04895 2.7807-0.08872 4.1756 0.0673 0.4895 0.11319 1.0156 0.17131 1.5295 0.10707 0.9392 0.21414 1.8722 0.34568 2.8052l11.998-2.1413c1.5938-1.5969 3.0927-3.2488 4.5794-4.9771z" fill="#EFEEEE"/>
<path d="m21.932 21.315c0.597-0.7226 1.2408-1.4052 1.9272-2.0434l-5.5522-17.213c-0.1143-0.35833-0.3296-0.67606-0.62-0.91508-0.2905-0.23902-0.6437-0.38917-1.0173-0.43244-0.3736-0.043273-0.7518 0.022171-1.0892 0.18848-0.3374 0.1663-0.6196 0.42642-0.8128 0.74913l-0.1652 0.27837-0.7342 1.2236-8.9202 14.846c0 2.0374-0.06119 4.0716-0.11625 6.1182 0.0673 0.4864 0.11319 1.0247 0.17131 1.5295 0.14683 1.2634 0.30591 2.5237 0.48945 3.7749l10.633-1.9211c2.0396-1.9604 3.9775-4.0239 5.8061-6.1824z" fill="#232323"/>
<path d="m14.968 25.738-9.4403 1.6916c3.157-0.4058 6.3038-0.9697 9.4403-1.6916z" fill="#232323"/>
<path d="m18.62 24.984c-1.2053 0.2325-2.4473 0.4864-3.6709 0.7525l3.5485-0.6363 0.1224-0.1162z" fill="#232323"/>
<path d="m21.934 21.313 0.3977-0.4894c-1.8599-6.0876-3.6097-12.218-5.8856-18.189-0.4563 0.69399-0.8505 1.4269-1.1778 2.1903-3.3374 6.0294-7.1368 11.303-10.373 17.045v0.3059l14.827 1.6519c0.7403-0.829 1.4776-1.658 2.2117-2.5146z" fill="#232323"/>
<path d="m21.932 21.316c0.4161-0.4894 0.8443-0.9789 1.3001-1.4653l-6.1273-17.403c-0.0784-0.20606-0.2253-0.37888-0.416-0.48945-0.1094-0.06702-0.231-0.1118-0.3578-0.13178-0.1267-0.01998-0.2562-0.01476-0.3809 0.01536-0.1248 0.03012-0.2424 0.08455-0.346 0.16017-0.1037 0.07562-0.1915 0.17094-0.2582 0.28051l-10.422 17.357c0 1.4653-0.052 2.9765-0.09177 4.4632 0.0673 0.4864 0.11319 1.0248 0.17131 1.5296 0.08871 0.7586 0.18048 1.5295 0.27837 2.279l12.334-1.8783c1.502-1.5173 2.9092-3.0591 4.3163-4.7171z" fill="#EFEEEE"/>
<path d="m5.0313 34.34v-32.383c0.00108-0.18628 0.05546-0.36836 0.15671-0.52472s0.24514-0.28048 0.41467-0.35768c0.16953-0.07721 0.35762-0.10428 0.54204-0.078012 0.18442 0.026262 0.35747 0.10477 0.49871 0.22623l19.422 16.176c0.1968 0.1669 0.32 0.4046 0.3429 0.6616 0.0229 0.2571-0.0563 0.5128-0.2205 0.7119-0.0384 0.045-0.0793 0.0879-0.1224 0.1285l-19.428 16.192c-0.14256 0.1206-0.31672 0.1978-0.50182 0.2223-0.18509 0.0246-0.37335-0.0045-0.54243-0.0837s-0.31187-0.2053-0.41145-0.3632c-0.09957-0.158-0.15174-0.3412-0.15031-0.5279z" fill="#0AFF40"/>
<path d="m25.437 18.148-19.431-16.192v32.383l19.431-16.192zm1.9548 0c9e-4 0.2872-0.0617 0.571-0.1834 0.8312-0.1216 0.2602-0.2993 0.4903-0.5202 0.6738l-19.425 16.186c-0.28551 0.2382-0.63296 0.3901-1.0017 0.4381-0.36874 0.048-0.7435-0.0101-1.0805-0.1673-0.33695-0.1573-0.62216-0.4072-0.82225-0.7206s-0.30679-0.6774-0.30762-1.0492v-32.383c2.5e-4 -0.3721 0.10653-0.73642 0.30639-1.0503 0.19987-0.31386 0.48504-0.56428 0.8221-0.72189 0.33707-0.15762 0.71207-0.21592 1.0811-0.16807s0.71674 0.19987 1.0024 0.43824l19.425 16.192c0.2202 0.1835 0.3974 0.4132 0.519 0.6727 0.1216 0.2596 0.1846 0.5427 0.1846 0.8294z" fill="#232323"/>
<path d="m26.762 17.52c0.102 0.0797 0.1683 0.1966 0.1843 0.325 0.0161 0.1284-0.0194 0.2579-0.0986 0.3603-0.0262 0.0298-0.0549 0.0574-0.0857 0.0826l-21.086 16.666c-0.05057 0.0398-0.10852 0.0693-0.17052 0.0868-0.062 0.0174-0.12682 0.0224-0.19076 0.0147-0.06394-0.0076-0.12574-0.0279-0.18186-0.0595-0.05611-0.0316-0.10543-0.0739-0.14515-0.1246-0.06636-0.0881-0.10184-0.1956-0.10094-0.3059v-33.329c-3.4e-4 -0.09166 0.02523-0.18155 0.07377-0.25931 0.04853-0.07776 0.11805-0.14022 0.20054-0.18019 0.08249-0.039966 0.1746-0.05581 0.2657-0.045704s0.1775 0.045751 0.24922 0.10282l21.086 16.666z" fill="#0AFF40"/>
<path d="m5.0313 34.34v-32.383c0.00108-0.18628 0.05546-0.36836 0.15671-0.52472s0.24514-0.28048 0.41467-0.35768c0.16953-0.07721 0.35762-0.10428 0.54204-0.078012 0.18442 0.026262 0.35747 0.10477 0.49871 0.22623l19.422 16.176c0.1968 0.1669 0.32 0.4046 0.3429 0.6616 0.0229 0.2571-0.0563 0.5128-0.2205 0.7119-0.0384 0.045-0.0793 0.0879-0.1224 0.1285l-19.428 16.192c-0.14256 0.1206-0.31672 0.1978-0.50182 0.2223-0.18509 0.0246-0.37335-0.0045-0.54243-0.0837s-0.31187-0.2053-0.41145-0.3632c-0.09957-0.158-0.15174-0.3412-0.15031-0.5279z" fill="#0AFF40"/>
<path d="m25.437 18.148-19.431-16.192v32.383l19.431-16.192zm-14.093-14.286 15.344 12.784c0.1978 0.1639 0.3614 0.3652 0.4812 0.5924 0.1199 0.2271 0.1937 0.4757 0.2173 0.7315s-0.0035 0.5137-0.0798 0.759-0.2003 0.4731-0.3648 0.6703c-0.0776 0.0914-0.1625 0.1763-0.2539 0.2539l-19.425 16.186c-0.28551 0.2382-0.63296 0.3901-1.0017 0.4381-0.36874 0.048-0.7435-0.0101-1.0805-0.1673-0.33695-0.1573-0.62216-0.4072-0.82225-0.7206s-0.30679-0.6774-0.30762-1.0492v-32.383c2.5e-4 -0.3721 0.10653-0.73642 0.30639-1.0503 0.19987-0.31386 0.48504-0.56428 0.8221-0.72189 0.33707-0.15762 0.71207-0.21592 1.0811-0.16807s0.71674 0.19987 1.0024 0.43824l3.42 2.8602 0.6608 0.54757zm-0.6608-0.54757 0.6608 0.54757z" fill="#232323"/>
<path d="m26.311 17.53c0.099 0.0808 0.1622 0.1974 0.176 0.3245 0.0137 0.1271-0.0231 0.2545-0.1026 0.3546l-0.0642 0.0612-19.645 16.602c-0.04877 0.0421-0.10536 0.0742-0.16653 0.0943-0.06117 0.0202-0.12572 0.0281-0.18994 0.0232-0.06423-0.0048-0.12687-0.0223-0.18434-0.0513-0.05746-0.0291-0.10862-0.0693-0.15054-0.1182-0.07165-0.0862-0.11255-0.1938-0.11625-0.3059v-33.218c-0.00305-0.09415 0.02147-0.18715 0.07056-0.26755 0.04909-0.080402 0.12061-0.14471 0.20576-0.18501 0.08514-0.0403 0.18021-0.054838 0.27352-0.041826 0.0933 0.013011 0.18076 0.053003 0.25164 0.11506l19.642 16.614z" fill="#2B6CCE"/>
</svg>
`
const x_button_dark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" width="18px" height="18px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/></svg>`

const space_to_read = `<?xml version="1.0" encoding="UTF-8"?>
<svg fill="none" viewBox="0 0 215 33" xmlns="http://www.w3.org/2000/svg">
<path d="m141.53 10.909v1.7045h-6.784v-1.7045h6.784zm-4.807-3.1364h2.012v12.477c0 0.5682 0.082 0.9943 0.247 1.2784 0.17 0.2784 0.386 0.4659 0.648 0.5625 0.267 0.0909 0.548 0.1364 0.843 0.1364 0.222 0 0.404-0.0114 0.546-0.0341 0.142-0.0284 0.255-0.0512 0.341-0.0682l0.409 1.8068c-0.137 0.0512-0.327 0.1023-0.571 0.1534-0.245 0.0568-0.554 0.0853-0.929 0.0853-0.568 0-1.125-0.1222-1.671-0.3665-0.539-0.2443-0.988-0.6165-1.346-1.1165-0.353-0.5-0.529-1.1307-0.529-1.892v-13.023zm13.01 16.5c-1.182 0-2.219-0.2812-3.111-0.8437-0.886-0.5625-1.579-1.3495-2.079-2.3608-0.494-1.0114-0.742-2.1932-0.742-3.5455 0-1.3636 0.248-2.554 0.742-3.571 0.5-1.017 1.193-1.8068 2.079-2.3693 0.892-0.5625 1.929-0.8438 3.111-0.8438s2.216 0.2813 3.102 0.8438c0.893 0.5625 1.586 1.3523 2.08 2.3693 0.5 1.017 0.75 2.2074 0.75 3.571 0 1.3523-0.25 2.5341-0.75 3.5455-0.494 1.0113-1.187 1.7983-2.08 2.3608-0.886 0.5625-1.92 0.8437-3.102 0.8437zm0-1.8068c0.898 0 1.637-0.2301 2.216-0.6903 0.58-0.4603 1.009-1.0654 1.287-1.8154s0.418-1.5625 0.418-2.4375-0.14-1.6903-0.418-2.446-0.707-1.3665-1.287-1.8324c-0.579-0.4659-1.318-0.6988-2.216-0.6988s-1.636 0.2329-2.216 0.6988c-0.579 0.4659-1.008 1.0767-1.287 1.8324-0.278 0.7557-0.417 1.571-0.417 2.446s0.139 1.6875 0.417 2.4375c0.279 0.75 0.708 1.3551 1.287 1.8154 0.58 0.4602 1.318 0.6903 2.216 0.6903zm15.752 1.5341v-13.091h1.944v1.9773h0.136c0.239-0.6478 0.67-1.1733 1.295-1.5767 0.625-0.4035 1.33-0.6052 2.114-0.6052 0.148 0 0.332 0.0029 0.554 0.0086 0.222 0.0056 0.389 0.0142 0.503 0.0255v2.0455c-0.068-0.0171-0.225-0.0426-0.469-0.0767-0.239-0.0398-0.491-0.0597-0.758-0.0597-0.637 0-1.205 0.1335-1.705 0.4006-0.494 0.2614-0.886 0.625-1.176 1.0909-0.284 0.4602-0.426 0.9858-0.426 1.5767v8.2841h-2.012zm14.02 0.2727c-1.261 0-2.349-0.2784-3.264-0.8352-0.909-0.5625-1.611-1.3466-2.105-2.3523-0.489-1.0113-0.733-2.1875-0.733-3.5284s0.244-2.5227 0.733-3.5454c0.494-1.0284 1.182-1.8296 2.062-2.4034 0.887-0.5796 1.921-0.8694 3.103-0.8694 0.682 0 1.355 0.1137 2.02 0.3409 0.664 0.2273 1.269 0.5966 1.815 1.108 0.545 0.5057 0.98 1.1761 1.304 2.0114 0.324 0.8352 0.486 1.8636 0.486 3.0852v0.8523h-10.091v-1.7387h8.045c0-0.7386-0.147-1.3977-0.443-1.9772-0.29-0.5796-0.704-1.037-1.244-1.3722-0.534-0.3352-1.165-0.5028-1.892-0.5028-0.801 0-1.495 0.1988-2.08 0.5965-0.579 0.3921-1.025 0.9035-1.338 1.5341-0.312 0.6307-0.469 1.3069-0.469 2.0284v1.1591c0 0.9887 0.171 1.8267 0.512 2.5142 0.346 0.6819 0.826 1.2017 1.44 1.5597 0.614 0.3523 1.327 0.5284 2.139 0.5284 0.529 0 1.006-0.0739 1.432-0.2216 0.432-0.1534 0.804-0.3807 1.117-0.6818 0.312-0.3068 0.554-0.6875 0.724-1.142l1.943 0.5454c-0.204 0.6591-0.548 1.2386-1.031 1.7386-0.483 0.4944-1.08 0.8807-1.79 1.1591-0.71 0.2728-1.508 0.4091-2.395 0.4091zm12.333 0.0341c-0.83 0-1.583-0.1562-2.259-0.4687-0.676-0.3182-1.213-0.7756-1.611-1.3722-0.397-0.6023-0.596-1.3295-0.596-2.1818 0-0.75 0.147-1.358 0.443-1.8239 0.295-0.4716 0.69-0.8409 1.185-1.1079 0.494-0.2671 1.039-0.4659 1.636-0.5966 0.602-0.1364 1.207-0.2443 1.815-0.3239 0.796-0.1023 1.441-0.179 1.935-0.2301 0.5-0.0568 0.864-0.1506 1.091-0.2812 0.233-0.1307 0.349-0.358 0.349-0.6819v-0.0681c0-0.841-0.23-1.4944-0.69-1.9603-0.455-0.4659-1.145-0.6988-2.071-0.6988-0.96 0-1.713 0.2102-2.259 0.6306-0.545 0.4205-0.929 0.8694-1.15 1.3466l-1.909-0.6818c0.341-0.7954 0.795-1.4148 1.363-1.8579 0.574-0.4489 1.199-0.7614 1.875-0.9375 0.682-0.1819 1.353-0.2728 2.012-0.2728 0.42 0 0.903 0.0512 1.449 0.1534 0.551 0.0966 1.082 0.2983 1.593 0.6052 0.517 0.3068 0.946 0.7698 1.287 1.3892 0.341 0.6193 0.512 1.4488 0.512 2.4886v8.625h-2.012v-1.7727h-0.102c-0.136 0.2841-0.364 0.588-0.682 0.9119s-0.741 0.5994-1.27 0.8267c-0.528 0.2273-1.173 0.3409-1.934 0.3409zm0.306-1.8068c0.796 0 1.466-0.1562 2.012-0.4688 0.551-0.3124 0.966-0.7159 1.244-1.2102 0.284-0.4943 0.426-1.0142 0.426-1.5596v-1.8409c-0.085 0.1022-0.272 0.196-0.562 0.2812-0.284 0.0795-0.614 0.1506-0.989 0.2131-0.369 0.0568-0.73 0.1079-1.082 0.1534-0.347 0.0398-0.628 0.0738-0.844 0.1023-0.523 0.0681-1.011 0.1789-1.466 0.3323-0.449 0.1478-0.812 0.3722-1.091 0.6733-0.273 0.2955-0.409 0.6989-0.409 1.2103 0 0.6988 0.259 1.2272 0.776 1.5852 0.522 0.3523 1.184 0.5284 1.985 0.5284zm14.308 1.7727c-1.091 0-2.054-0.2755-2.889-0.8267-0.835-0.5568-1.489-1.3409-1.96-2.3522-0.472-1.0171-0.708-2.2188-0.708-3.6052 0-1.375 0.236-2.5681 0.708-3.5795 0.471-1.0114 1.127-1.7926 1.968-2.3438 0.841-0.5511 1.813-0.8267 2.915-0.8267 0.852 0 1.526 0.1421 2.02 0.4262 0.5 0.2784 0.881 0.5966 1.142 0.9545 0.267 0.3523 0.474 0.6421 0.622 0.8693h0.171v-6.4432h2.011v17.455h-1.943v-2.0114h-0.239c-0.148 0.2387-0.358 0.5398-0.631 0.9034-0.272 0.358-0.661 0.679-1.167 0.9631-0.506 0.2784-1.179 0.4176-2.02 0.4176zm0.273-1.8068c0.807 0 1.488-0.2102 2.045-0.6307 0.557-0.4261 0.98-1.0142 1.27-1.7642 0.29-0.7557 0.435-1.6278 0.435-2.6165 0-0.9772-0.142-1.8323-0.426-2.5653-0.285-0.7386-0.705-1.3125-1.262-1.7216-0.557-0.4148-1.244-0.6221-2.062-0.6221-0.853 0-1.563 0.2187-2.131 0.6562-0.562 0.4318-0.986 1.0199-1.27 1.7642-0.278 0.7386-0.417 1.5682-0.417 2.4886 0 0.9319 0.142 1.7785 0.426 2.5398 0.289 0.7557 0.716 1.358 1.278 1.8068 0.568 0.4432 1.273 0.6648 2.114 0.6648z" fill="#636262"/>
<path d="m0 9c0-3.866 3.134-7 7-7h106c3.866 0 7 3.134 7 7v17c0 3.866-3.134 7-7 7h-106c-3.866 0-7-3.134-7-7v-17z" fill="url(#a)"/>
<path d="m5.5236 2.8652c0.15996-0.06665 0.28598-0.16134 0.38026-0.27313 0.35634-0.06052 0.72256-0.09203 1.0961-0.09203h106c3.59 0 6.5 2.9102 6.5 6.5v17c0 3.5898-2.91 6.5-6.5 6.5h-106c-3.5898 0-6.5-2.9101-6.5-6.5v-17c0-2.8157 1.7904-5.2133 4.2948-6.1164 0.21132 0.08481 0.46204 0.09269 0.72877-0.01845z" stroke="#636262" stroke-opacity=".4"/>
<rect x="3.5" y=".5" width="119" height="29" rx="5.5" fill="#fff" stroke="#636262"/>
<path d="m42.798 11.957-1.4304 0.4048c-0.09-0.2384-0.2227-0.47-0.3981-0.6949-0.1709-0.2294-0.4048-0.4184-0.7017-0.5668s-0.677-0.2227-1.1403-0.2227c-0.6342 0-1.1627 0.1462-1.5855 0.4386-0.4184 0.2879-0.6275 0.6545-0.6275 1.0998 0 0.3958 0.1439 0.7084 0.4318 0.9378 0.2879 0.2295 0.7377 0.4206 1.3494 0.5736l1.5384 0.3778c0.9266 0.2249 1.617 0.569 2.0714 1.0323 0.4543 0.4588 0.6814 1.0503 0.6814 1.7745 0 0.5938-0.1709 1.1245-0.5128 1.5923-0.3373 0.4678-0.8096 0.8367-1.4169 1.1066-0.6072 0.2699-1.3134 0.4048-2.1186 0.4048-1.057 0-1.9319-0.2294-2.6246-0.6882s-1.1313-1.129-1.3157-2.0107l1.5113-0.3778c0.144 0.5578 0.4161 0.9761 0.8164 1.255 0.4049 0.2789 0.9334 0.4183 1.5856 0.4183 0.7422 0 1.3315-0.1574 1.7678-0.4723 0.4408-0.3194 0.6612-0.7017 0.6612-1.147 0-0.3599-0.1259-0.6612-0.3778-0.9041-0.2519-0.2474-0.6388-0.4319-1.1605-0.5533l-1.7273-0.4048c-0.9491-0.2249-1.6463-0.5735-2.0916-1.0458-0.4408-0.4768-0.6613-1.0728-0.6613-1.788 0-0.5848 0.1642-1.1021 0.4926-1.5519 0.3328-0.4498 0.7849-0.8029 1.3562-1.0593 0.5757-0.25639 1.2279-0.38459 1.9566-0.38459 1.0256 0 1.8308 0.22491 2.4155 0.67468 0.5893 0.4498 1.0076 1.0436 1.255 1.7813zm3.3458 11.929v-14.25h1.5384v1.6463h0.1889c0.117-0.18 0.2789-0.4094 0.4858-0.6882 0.2114-0.2834 0.5128-0.5353 0.9041-0.75572 0.3959-0.22491 0.9311-0.33736 1.6059-0.33736 0.8726 0 1.6418 0.21816 2.3075 0.65448 0.6657 0.4363 1.1852 1.0548 1.5586 1.8555 0.3733 0.8006 0.56 1.7452 0.56 2.8338 0 1.0975-0.1867 2.0489-0.56 2.854-0.3734 0.8007-0.8906 1.4214-1.5519 1.8622-0.6612 0.4364-1.4236 0.6545-2.2873 0.6545-0.6657 0-1.1987-0.1102-1.599-0.3306-0.4004-0.2249-0.7085-0.4791-0.9244-0.7624-0.2159-0.2879-0.3823-0.5263-0.4993-0.7152h-0.1349v5.4787h-1.5924zm1.5654-9.0682c0 0.7827 0.1147 1.4731 0.3441 2.0714 0.2294 0.5937 0.5645 1.0593 1.0053 1.3966 0.4408 0.3329 0.9806 0.4993 1.6193 0.4993 0.6658 0 1.2213-0.1754 1.6666-0.5263 0.4498-0.3553 0.7872-0.8321 1.0121-1.4304 0.2294-0.6027 0.3441-1.2729 0.3441-2.0106 0-0.7287-0.1125-1.3854-0.3374-1.9702-0.2204-0.5892-0.5555-1.0548-1.0053-1.3967-0.4453-0.3463-1.0053-0.5195-1.6801-0.5195-0.6477 0-1.192 0.1642-1.6328 0.4926-0.4408 0.3238-0.7737 0.7781-0.9986 1.3629-0.2249 0.5802-0.3373 1.2572-0.3373 2.0309zm13.822 5.4247c-0.6567 0-1.2527-0.1237-1.788-0.3711-0.5353-0.2519-0.9604-0.614-1.2752-1.0863-0.3149-0.4768-0.4723-1.0525-0.4723-1.7273 0-0.5937 0.1169-1.075 0.3508-1.4439 0.2339-0.3733 0.5465-0.6657 0.9379-0.8771 0.3913-0.2114 0.8231-0.3688 1.2954-0.4723 0.4768-0.1079 0.9559-0.1934 1.4372-0.2564 0.6297-0.0809 1.1403-0.1417 1.5316-0.1822 0.3958-0.0449 0.6837-0.1192 0.8636-0.2226 0.1844-0.1035 0.2767-0.2834 0.2767-0.5398v-0.054c0-0.6657-0.1822-1.183-0.5466-1.5518-0.3598-0.3688-0.9063-0.5533-1.6395-0.5533-0.7602 0-1.3562 0.1665-1.788 0.4993-0.4318 0.3329-0.7355 0.6882-0.9109 1.0661l-1.5114-0.5398c0.2699-0.6297 0.6298-1.12 1.0796-1.4709 0.4543-0.3553 0.9491-0.60273 1.4844-0.74217 0.5397-0.14394 1.0705-0.21591 1.5923-0.21591 0.3329 0 0.7152 0.04048 1.147 0.12145 0.4363 0.07647 0.8569 0.23615 1.2617 0.47903 0.4094 0.2429 0.749 0.6095 1.0189 1.0998 0.2698 0.4903 0.4048 1.147 0.4048 1.9702v6.8281h-1.5923v-1.4034h-0.081c-0.108 0.2249-0.2879 0.4655-0.5398 0.7219s-0.587 0.4746-1.0053 0.6545-0.9289 0.2699-1.5316 0.2699zm0.2429-1.4304c0.6297 0 1.1605-0.1237 1.5923-0.3711 0.4363-0.2474 0.7647-0.5668 0.9851-0.9581 0.2249-0.3913 0.3374-0.8029 0.3374-1.2347v-1.4574c-0.0675 0.081-0.216 0.1552-0.4454 0.2226-0.2249 0.063-0.4858 0.1192-0.7826 0.1687-0.2924 0.045-0.578 0.0855-0.8569 0.1215-0.2744 0.0315-0.4971 0.0585-0.668 0.0809-0.4138 0.054-0.8006 0.1417-1.1605 0.2632-0.3553 0.1169-0.6432 0.2946-0.8636 0.533-0.2159 0.2339-0.3239 0.5533-0.3239 0.9581 0 0.5533 0.2047 0.9716 0.614 1.255 0.4138 0.2789 0.9379 0.4183 1.5721 0.4183zm12.384 1.4034c-0.9716 0-1.8083-0.2294-2.51-0.6882s-1.2415-1.0908-1.6193-1.896c-0.3779-0.8051-0.5668-1.725-0.5668-2.7595 0-1.0526 0.1934-1.9815 0.5803-2.7866 0.3913-0.8097 0.9356-1.4417 1.6328-1.896 0.7017-0.45878 1.5204-0.68818 2.456-0.68818 0.7287 0 1.3854 0.13494 1.9701 0.40483 0.5848 0.26985 1.0638 0.64775 1.4372 1.1336 0.3733 0.4858 0.605 1.0525 0.6949 1.7003h-1.5923c-0.1214-0.4723-0.3913-0.8907-0.8097-1.255-0.4138-0.3689-0.9715-0.5533-1.6732-0.5533-0.6208 0-1.1651 0.1619-1.6329 0.4858-0.4633 0.3194-0.8254 0.7714-1.0863 1.3562-0.2563 0.5802-0.3845 1.2617-0.3845 2.0444 0 0.8006 0.1259 1.4979 0.3778 2.0916 0.2564 0.5938 0.6162 1.0548 1.0795 1.3832 0.4678 0.3283 1.0166 0.4925 1.6464 0.4925 0.4138 0 0.7894-0.072 1.1267-0.2159 0.3374-0.1439 0.623-0.3508 0.8569-0.6207s0.4003-0.5938 0.4993-0.9716h1.5923c-0.0899 0.6117-0.3126 1.1627-0.6679 1.653-0.3509 0.4858-0.8164 0.8727-1.3967 1.1605-0.5758 0.2834-1.246 0.4251-2.0106 0.4251zm11.508 0c-0.9986 0-1.86-0.2204-2.5842-0.6612-0.7197-0.4453-1.2752-1.0661-1.6665-1.8622-0.3869-0.8007-0.5803-1.7318-0.5803-2.7934 0-1.0615 0.1934-1.9971 0.5803-2.8068 0.3913-0.8141 0.9356-1.4484 1.6328-1.9027 0.7017-0.45878 1.5203-0.68818 2.4559-0.68818 0.5398 0 1.0728 0.08996 1.5991 0.26989 0.5263 0.17992 1.0053 0.47229 1.4372 0.87709 0.4318 0.4004 0.7759 0.9311 1.0323 1.5924 0.2564 0.6612 0.3846 1.4753 0.3846 2.4424v0.6748h-7.9887v-1.3765h6.3694c0-0.5847-0.117-1.1065-0.3509-1.5653-0.2294-0.4588-0.5578-0.8209-0.9851-1.0863-0.4228-0.2654-0.9221-0.3981-1.4979-0.3981-0.6342 0-1.183 0.1575-1.6463 0.4723-0.4588 0.3104-0.8119 0.7152-1.0593 1.2145s-0.3711 1.0346-0.3711 1.6058v0.9176c0 0.7827 0.135 1.4462 0.4049 1.9905 0.2744 0.5397 0.6544 0.9513 1.1402 1.2347 0.4858 0.2789 1.0503 0.4183 1.6936 0.4183 0.4183 0 0.7961-0.0585 1.1335-0.1754 0.3419-0.1215 0.6365-0.3014 0.8839-0.5398 0.2474-0.2429 0.4385-0.5443 0.5735-0.9041l1.5383 0.4318c-0.1619 0.5218-0.434 0.9806-0.8164 1.3764-0.3823 0.3914-0.8546 0.6972-1.4169 0.9176-0.5622 0.216-1.1942 0.3239-1.8959 0.3239z" fill="#636262"/>
<defs>
<linearGradient id="a" x1="60" x2="60" y1=".5" y2="33" gradientUnits="userSpaceOnUse">
<stop stop-color="#fff" offset="0"/>
<stop stop-color="#fff" stop-opacity="0" offset="1"/>
</linearGradient>
</defs>
</svg>

`

