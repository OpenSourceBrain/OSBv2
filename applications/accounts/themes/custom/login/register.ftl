<#import "template.ftl" as layout>
<@layout.registrationLayout; section>
    <#if section = "header">
        ${msg("registerTitle")}
        <div id="kc-form-options">
            <div class="${properties.kcFormOptionsWrapperClass!}">
                <span>Already have an account? <a href="${url.loginUrl}">${kcSanitize(msg("Log In"))?no_esc}</a></span>
            </div>
        </div>
        <div class="login-pf-logo"></div>
    <#elseif section = "form">
        <form id="kc-register-form" class="kc-register-form" action="${url.registrationAction}" method="post">
            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('firstName',properties.kcFormGroupErrorClass!)}">
                <input type="text" id="firstName" class="${properties.kcInputClass!}" name="firstName" value="${(register.formData.firstName!'')}" placeholder="First Name" /> 
            </div>

            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('lastName',properties.kcFormGroupErrorClass!)}">
                <input type="text" id="lastName" class="${properties.kcInputClass!}" name="lastName" value="${(register.formData.lastName!'')}"  placeholder="Last Name" />
            </div>

            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('email',properties.kcFormGroupErrorClass!)}">
                <input type="text" id="email" class="${properties.kcInputClass!}" name="email" value="${(register.formData.email!'')}" autocomplete="email" placeholder="Email" />
            </div>

          <#if !realm.registrationEmailAsUsername>
            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('username',properties.kcFormGroupErrorClass!)}">
               <input type="text" id="username" class="${properties.kcInputClass!}" name="username" value="${(register.formData.username!'')}" autocomplete="username" placeholder="Username" />
            </div>
          </#if>

            <#if passwordRequired??>
            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('password',properties.kcFormGroupErrorClass!)}">
               <input type="password" id="password" class="${properties.kcInputClass!}" name="password" autocomplete="new-password" placeholder="Password" />
            </div>

            <div class="${properties.kcFormGroupClass!} ${messagesPerField.printIfExists('password-confirm',properties.kcFormGroupErrorClass!)}">
               <input type="password" id="password-confirm" class="${properties.kcInputClass!}" name="password-confirm" placeholder="Confirm Password" />
            </div>
            </#if>

            <#if recaptchaRequired??>
            <div class="form-group">
               <div class="g-recaptcha" data-size="compact" data-sitekey="${recaptchaSiteKey}"></div>
             </div>
            </#if>

            <div class="form-group kc-form-footer">
                <div id="kc-form-buttons" class="kc-form-button">
                    <input class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" type="submit" value="${msg("doRegister")}"/>
                </div>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>
