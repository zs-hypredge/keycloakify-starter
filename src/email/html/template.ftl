<#--
  This file has been claimed for ownership from @keycloakify/email-native version 260007.0.0.
  To relinquish ownership and restore this file to its original content, run the following command:

  $ npx keycloakify own --path "email/html/template.ftl" --revert
-->

<#assign productId = (properties.ZS_PRODUCT_ID)!"hypredge">
<#assign isHypredge = (productId?lower_case != "trellix")>
<#assign logoFile = isHypredge?then("hypredge_logo.svg", "trellix_logo.svg")>
<#assign primaryColor = isHypredge?then("#7371fc", "#87bfff")>
<#assign bgColor = isHypredge?then("#0a0f24", "#111111")>
<#assign productName = isHypredge?then("HyprEdge", "Trellix")>

<#macro emailLayout>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: ${bgColor}; padding: 30px 40px; border-radius: 8px 8px 0 0;">
                            <img src="${url.resourcesUrl}/${logoFile}" alt="${productName}" width="180" style="display: block;">
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="background-color: #ffffff; padding: 40px; font-size: 15px; line-height: 1.6; color: #333333;">
                            <#nested>
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding: 20px 40px; font-size: 12px; color: #999999;">
                            &copy; ${.now?string('yyyy')} ${productName}. All rights reserved.
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
</#macro>
