require('dotenv').config()

const signUp = (verification_code) => {
  const template =
    `<!doctype html>
    <html ⚡4email data-css-strict>
    
    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <style amp4email-boilerplate>
        body {
          visibility: hidden
        }
      </style>
    
      <script async src="https://cdn.ampproject.org/v0.js"></script>
    
    
      <style amp-custom>
        .u-row {
          display: flex;
          flex-wrap: nowrap;
          margin-left: 0;
          margin-right: 0;
        }
        
        .u-row .u-col {
          position: relative;
          width: 100%;
          padding-right: 0;
          padding-left: 0;
        }
        
        .u-row .u-col.u-col-100 {
          flex: 0 0 100%;
          max-width: 100%;
        }
        
        @media (max-width: 767px) {
          .u-row:not(.no-stack) {
            flex-wrap: wrap;
          }
          .u-row:not(.no-stack) .u-col {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }
        
        body {
          margin: 0;
          padding: 0;
        }
        
        table,
        tr,
        td {
          vertical-align: top;
          border-collapse: collapse;
        }
        
        p {
          margin: 0;
        }
        
        .ie-container table,
        .mso-container table {
          table-layout: fixed;
        }
        
        * {
          line-height: inherit;
        }
        
        table,
        td {
          color: #000000;
        }
        
        #u_body a {
          color: #0000ee;
          text-decoration: underline;
        }
      </style>
    
    
    </head>
    
    <body class="clean-body u_body" style="margin: 0;padding: 0;background-color: #f9f9f9;color: #000000">
      <div class="ie-container">
      <div class="mso-container">
      <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%" cellpadding="0" cellspacing="0">
        <tbody>
          <tr style="vertical-align: top">
            <td style="word-break: break-word;border-collapse: collapse;vertical-align: top">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #f9f9f9;">
    
              <div style="padding: 0px;">
                <div style="max-width: 600px;margin: 0 auto;background-color: #0061bf;">
                  <div class="u-row">
    
                    <div class="u-col u-col-100" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <div style="width: 100%;padding:0px;">
    
                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:18px 10px 0px;font-family:'Cabin',sans-serif;" align="left">
    
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
    
                                      <amp-img alt="Image" src="https://assets.unlayer.com/projects/147811/1680071619852-starjobs-whole-white-text.png" width="792" height="348" layout="intrinsic" style="width: 49%;max-width: 49%;">
    
                                      </amp-img>
                                    </td>
                                  </tr>
                                </table>
    
                              </td>
                            </tr>
                          </tbody>
                        </table>
    
                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 5px 16px;font-family:'Cabin',sans-serif;" align="left">
    
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
    
                                      <amp-img alt="Image" src="https://cdn.templates.unlayer.com/assets/1597218650916-xxxxc.png" width="335" height="93" layout="intrinsic" style="width: 26%;max-width: 26%;">
    
                                      </amp-img>
                                    </td>
                                  </tr>
                                </table>
    
                              </td>
                            </tr>
                          </tbody>
                        </table>
    
                      </div>
                    </div>
    
                  </div>
                </div>
              </div>
    
              <div style="padding: 0px;">
                <div style="max-width: 600px;margin: 0 auto;background-color: #ffffff;">
                  <div class="u-row">
    
                    <div class="u-col u-col-100" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <div style="width: 100%;padding:0px;">
    
                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
    
                                <div style="font-family: 'Open Sans',sans-serif; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 140%;"><span style="color: #000000; line-height: 19.6px;"><strong>T H A N K S   F O R   S I G N I N G   U P !</strong></span></p>
                                </div>
    
                              </td>
                            </tr>
                          </tbody>
                        </table>
    
                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 31px;font-family:'Cabin',sans-serif;" align="left">
    
                                <div style="font-family: 'Open Sans',sans-serif; color: #e5eaf5; line-height: 140%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 140%;"><span style="font-size: 28px; line-height: 39.2px; color: #000000;"><span style="line-height: 39.2px; font-size: 28px;">Verify Your Starjobs Account</span></span>
                                  </p>
                                </div>
    
                              </td>
                            </tr>
                          </tbody>
                        </table>
    
                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px;font-family:'Cabin',sans-serif;" align="left">
    
                                <div style="font-family: 'Open Sans',sans-serif; font-size: 18px; line-height: 160%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 18px; line-height: 28.8px;">Please copy the verification code below to verify you email address and enjoy exploring app.starjobs.com.ph</span></p>
                                </div>
    
                              </td>
                            </tr>
                          </tbody>
                        </table>
    
                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Cabin',sans-serif;" align="left">
    
                                <style>.v-button {background: transparent;}</style>
                                <div align="center">
                                  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:63px; v-text-anchor:middle; width:363px;" arcsize="35%"  stroke="f" fillcolor="#0061bf"><w:anchorlock/><center style="color:#FFFFFF;font-family:'Cabin',sans-serif;">
                                  <a target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;font-family:'Cabin',sans-serif;text-decoration: none;text-align: center;color: #FFFFFF; background-color: #0061bf; border-radius: 22px;  width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; border-top-width: 0px; border-top-style: solid; border-top-color: #CCC; border-left-width: 0px; border-left-style: solid; border-left-color: #CCC; border-right-width: 0px; border-right-style: solid; border-right-color: #CCC; border-bottom-width: 0px; border-bottom-style: solid; border-bottom-color: #CCC;font-family: 'Cabin',sans-serif; font-size: 30px;">
                                    <span style="display:block;padding:14px 44px 13px;line-height:120%;"><span style="line-height: 36px;"><strong><span style="line-height: 36px;">` +
    verification_code +
    `</span></strong>
                                    </span>
                                    </span>
                                  </a>
                                  </center></v:roundrect>
                                </div>
    
                              </td>
                            </tr>
                          </tbody>
                        </table>
    
                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:33px 55px 60px;font-family:'Cabin',sans-serif;" align="left">
    
                                <div style="line-height: 160%; text-align: center; word-wrap: break-word;">
                                  <p style="line-height: 160%; font-size: 14px;"><span style="font-size: 18px; line-height: 28.8px; font-family: 'Open Sans', sans-serif;">Thanks,</span></p>
                                  <p style="line-height: 160%; font-size: 14px;"><span style="font-size: 18px; line-height: 28.8px; font-family: 'Open Sans', sans-serif;">Starjobs Team</span></p>
                                </div>
    
                              </td>
                            </tr>
                          </tbody>
                        </table>
    
                      </div>
                    </div>
    
                  </div>
                </div>
              </div>
    
              <div style="padding: 0px;">
                <div style="max-width: 600px;margin: 0 auto;background-color: #d9d9d9;">
                  <div class="u-row">
    
                    <div class="u-col u-col-100" style="display:flex;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                      <div style="width: 100%;padding:0px;">
    
                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:41px 55px 18px;font-family:'Cabin',sans-serif;" align="left">
    
                                <div style="color: #003399; line-height: 160%; text-align: center; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 160%;"><span style="font-size: 26px; line-height: 41.6px; color: #000000; font-family: 'Open Sans', sans-serif;"><strong>Get in touch</strong></span></p>
                                  <p style="font-size: 14px; line-height: 160%;"><span style="font-family: 'Open Sans', sans-serif; line-height: 25.6px; font-size: 16px;">add.starjobsexec@<span style="line-height: 25.6px;">gmail</span>.com</span>
                                  </p>
                                </div>
    
                              </td>
                            </tr>
                          </tbody>
                        </table>
    
                        <table style="font-family:'Cabin',sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 33px;font-family:'Cabin',sans-serif;" align="left">
                                <div style="text-align:center;line-height:0px">
                                  <a href="https://facebook.com/" target="_blank" style="display:inline-block;width:32px;height:32px;margin-right:17px">
                                    <amp-img src="https://cdn.tools.unlayer.com/social/icons/circle-black/facebook.png" width="32" height="32" />
                                  </a>
                                  <a href="https://linkedin.com/" target="_blank" style="display:inline-block;width:32px;height:32px;margin-right:17px">
                                    <amp-img src="https://cdn.tools.unlayer.com/social/icons/circle-black/linkedin.png" width="32" height="32" />
                                  </a>
                                  <a href="https://instagram.com/" target="_blank" style="display:inline-block;width:32px;height:32px;margin-right:17px">
                                    <amp-img src="https://cdn.tools.unlayer.com/social/icons/circle-black/instagram.png" width="32" height="32" />
                                  </a>
                                  <a href="https://email.com/" target="_blank" style="display:inline-block;width:32px;height:32px;margin-right:0px">
                                    <amp-img src="https://cdn.tools.unlayer.com/social/icons/circle-black/email.png" width="32" height="32" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
    
                      </div>
                    </div>
    
                  </div>
                </div>
              </div>
    
              </td></tr></table>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
      </div>
    </body>
    
    </html>`
  return template
}

module.exports = signUp
