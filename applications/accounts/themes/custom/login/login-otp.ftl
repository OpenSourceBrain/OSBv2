<#import "template.ftl" as layout>
    <@layout.registrationLayout; section>
        <#if section="header">
            ${msg("doLogIn")}
            <#elseif section="form">
                <form id="kc-otp-login-form" class="${properties.kcFormClass!}" action="${url.loginAction}"
                    method="post">
                    <#if otpLogin.userOtpCredentials?size gt 1>
                        <div class="${properties.kcFormGroupClass!}">
                            <div class="${properties.kcInputWrapperClass!}">
                                <#list otpLogin.userOtpCredentials as otpCredential>
                                    <div class="${properties.kcSelectOTPListClass!}">
                                    <input type="hidden" value="${otpCredential.id}">
                                        <div class="${properties.kcSelectOTPListItemClass!}">
                                            <span class="${properties.kcAuthenticatorOtpCircleClass!}"></span>
                                            <h2 class="${properties.kcSelectOTPItemHeadingClass!}">
                                                ${otpCredential.userLabel}
                                            </h2>
                                        </div>
                                    </div>
                                </#list>
                            </div>
                        </div>
                    </#if>

                    <div class="${properties.kcFormGroupClass!}">
                        <div class="${properties.kcLabelWrapperClass!}">
                            <label for="otp" class="${properties.kcLabelClass!}">${msg("loginOtpOneTime")}</label>
                        </div>

                        <div class="${properties.kcInputWrapperClass!}">
                            <input id="otp" name="otp" autocomplete="off" type="text" class="${properties.kcInputClass!}"
                            autofocus/>
                        </div>
                    </div>

                    <div class="${properties.kcFormGroupClass!}">
                        <div id="kc-form-options" class="${properties.kcFormOptionsClass!}">
                            <div class="${properties.kcFormOptionsWrapperClass!}">
                            </div>
                        </div>

                        <div id="kc-form-buttons" class="${properties.kcFormButtonsClass!}">
                            <input
                                class="${properties.kcButtonClass!} ${properties.kcButtonPrimaryClass!} ${properties.kcButtonBlockClass!} ${properties.kcButtonLargeClass!}"
                                name="login" id="kc-login" type="submit" value="${msg("doLogIn")}" />
                        </div>
                    </div>
                </form>
            <script type="text/javascript">
            document.addEventListener('DOMContentLoaded', function() {
                // Card Single Select
                var cards = document.querySelectorAll('.card-pf-view-single-select');
                cards.forEach(function(card) {
                    card.addEventListener('click', function() {
                        if (card.classList.contains('active')) {
                            card.classList.remove('active');
                            Array.from(card.children).forEach(function(c) { c.removeAttribute('name'); });
                        } else {
                            cards.forEach(function(other) {
                                other.classList.remove('active');
                                Array.from(other.children).forEach(function(c) { c.removeAttribute('name'); });
                            });
                            card.classList.add('active');
                            Array.from(card.children).forEach(function(c) { c.setAttribute('name', 'selectedCredentialId'); });
                        }
                    });
                });

                if (cards[0]) {
                    cards[0].click();
                }
            });
            </script>
        </#if>
        </@layout.registrationLayout>