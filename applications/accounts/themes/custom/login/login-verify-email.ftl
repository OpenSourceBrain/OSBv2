<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
    <#if section = "header">
        ${msg("emailVerifyTitle")}
    <#elseif section = "form">
        <p class="instruction">
            ${msg("emailVerifyInstruction1")}
        </p>
        <p class="instruction">
            ${msg("emailVerifyInstruction2")} <a href="${url.loginAction}">${msg("doClickHere")}</a> ${msg("emailVerifyInstruction3")}
        </p>
        <p>If you are still having problems with this process, please get in contact at <a href="mailto:info@opensourcebrain.org">info@opensourcebrain.org</a></p>
    </#if>
</@layout.registrationLayout>