<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=true; section>
    <#if section = "header">
        ${msg("emailForgotTitle")}
        <div class="${properties.kcFormOptionsWrapperClass!}">
            <span><a href="${url.loginUrl}">${kcSanitize(msg("Back to Login"))?no_esc}</a></span>
        </div>
        <div class="login-pf-logo"></div>
    <#elseif section = "form">
        <form id="kc-reset-password-form" class="${properties.kcFormClass!}" action="${url.loginAction}" method="post">
            <div <#if message?has_content && message.type == 'error'>class="${properties.kcFormGroupClass!} ${properties.kcFormGroupErrorClass!}"</#if> class="${properties.kcFormGroupClass!}">
                <div class="${properties.kcInputWrapperClass!}">
                    <#if auth?has_content && auth.showUsername()>
                        <input placeholder="Username or Email" type="text" id="username" name="username" class="${properties.kcInputClass!}" autofocus value="${auth.attemptedUsername}"/>
                    <#else>
                        <input placeholder="Username or Email" type="text" id="username" name="username" class="${properties.kcInputClass!}" autofocus/>
                    </#if>
                </div>
            </div>
            <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                <div id="kc-form-options" class="${properties.kcFormOptionsClass!} kc-form-footer">
                    <div class="kc-form-paragraph">
                        <p>Enter your username or email address and</p>
                        <p>we will send you instructions on how to create a new password.</p>
                    </div>
                    <div id="kc-form-buttons" class="kc-form-button">
                        <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doSubmit")}"/>
                    </div>
                </div>
            </div>
        </form>
    <#elseif section = "info" >
        ${msg("emailInstruction")}
    </#if>
</@layout.registrationLayout>
