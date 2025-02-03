<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "header">
       <div class="login-register-link">
            <span>${msg("doLogIn")} </span>
            <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
                <div id="kc-registration" class="kc-register">
                    <span><a tabindex="6" href="${url.registrationUrl}">${msg("noAccount")} ${msg("doRegister")}</a></span>
                </div>
            </#if>
       </div>
      <div class="login-pf-logo"></div>

    <#elseif section = "form">
     <div id="kc-form" <#if realm.password && social.providers??>class="${properties.kcContentWrapperClass!}"</#if>>
        <#if realm.password && social.providers??>
            <div id="kc-social-providers" class="${properties.kcFormSocialAccountContentClass!} ${properties.kcFormSocialAccountClass!}">
                <ul class="${properties.kcFormSocialAccountListClass!} <#if social.providers?size gt 3>${properties.kcFormSocialAccountListGridClass!}</#if>">
                    <#list social.providers as p>
                        <li class="${properties.kcFormSocialAccountListLinkClass!}">
                            <a id="social-${p.alias}"  type="button" href="${p.loginUrl}">
                                    <i class="${properties.kcCommonLogoIdP!} ${p.iconClasses!}" aria-hidden="true"></i>
                                    <span class="${properties.kcFormSocialAccountNameClass!} kc-social-icon-text">Sign in with ${p.displayName!}</span>
                            </a>
                        </li>
                    </#list>
                </ul>
            </div>
            <div id="kc-form-separator" class="separator">or</div>
        </#if>

        <div id="kc-form-wrapper" <#if realm.password && social.providers??>class="${properties.kcFormSocialAccountContentClass!} ${properties.kcFormSocialAccountClass!}"</#if>>
                <#if realm.password>
                    <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                        <div <#if message?has_content && message.type == 'error'>class="${properties.kcFormGroupClass!} ${properties.kcFormGroupErrorClass!}"</#if> class="${properties.kcFormGroupClass!}">
                            <#if usernameEditDisabled??>
                                <input tabindex="1" id="username" class="${properties.kcInputClass!}" name="username" value="${(login.username!'')}" type="text" disabled placeholder="Username or Email" />
                            <#else>
                                <input tabindex="1" id="username" class="${properties.kcInputClass!}" name="username" value="${(login.username!'')}"  type="text" autofocus autocomplete="off" placeholder="Username or Email"  />
                            </#if>
                        </div>

                        <div <#if message?has_content && message.type == 'error'>class="${properties.kcFormGroupClass!} ${properties.kcFormGroupErrorClass!}"</#if> class="${properties.kcFormGroupClass!}">
                            <input tabindex="2" id="password" class="${properties.kcInputClass!}" name="password" type="password" autocomplete="off" placeholder="Password"/>
                        </div>

                        <div class="${properties.kcFormGroupClass!} ${properties.kcFormSettingClass!}">
                            <div class="kc-form-footer">
                                <div id="kc-form-options">
                                <#if realm.rememberMe && !usernameEditDisabled??>
                                    <div class="checkbox custom-checkbox">
                                        <label>
                                            <#if login.rememberMe??>
                                                <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" checked> <span>${msg("rememberMe")}</span>
                                                <span class="checkmark"></span>
                                            <#else>
                                                <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox"> <span>${msg("rememberMe")}</span>
                                                <span class="checkmark"></span>
                                            </#if>
                                        </label>
                                    </div>
                                </#if>
                                </div>
                                <div class="kc-form-button">
                                    <div class="${properties.kcFormOptionsWrapperClass!}">
                                        <#if realm.resetPasswordAllowed>
                                            <span><a tabindex="5" href="${url.loginResetCredentialsUrl}">${msg("doForgotPassword")}</a></span>
                                        </#if>
                                    </div>
                                    <div id="kc-form-buttons" class="${properties.kcFormGroupClass!}">
                                        <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                                        <input tabindex="4" class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}" name="login" id="kc-login" type="submit" value="${msg("doLogIn")}"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </#if>
                </div>
      </div>
   <#elseif section = "info" >

    </#if>

</@layout.registrationLayout>
