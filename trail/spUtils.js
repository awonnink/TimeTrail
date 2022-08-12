export class spUtills{
    isOWAFile = function (fileType) {
        return "doc;docx;dotx;xlsx;pptx;".indexOf(fileType + ";") > -1;
    };
    getOpenUrl= function(url, siteUrl, asPreview=true){
        var fileType=this.getFileType(url);

        if(this.isOWAFile(fileType)){
            //return `ms-word:ofe|u|${url}`;
            return this.getWopIframeUrl(url, siteUrl, asPreview);
        }
        if(asPreview){
            if (fileType=== "msg") {
                var doclibUrl=this.getDoclibUrl(url);
                var relDocUrl=`/${this.getRelativeDocUrl(url)}`;
                var spl = `/${this.getRelativeSiteUrl(url)}`;
            return doclibUrl + '/Forms/AllItems.aspx?id=' + encodeURIComponent(relDocUrl) + '&parent=' + encodeURIComponent(spl);
            }
            return url;
        }
    }
    getDoclibUrl=function(url){
        var array = url.split('/');
        var nw=array.slice(0, 6);
        return nw.join('/');
    }
    getRelativeDocUrl=function(url){
        var array = url.split('/');
        var nw=array.slice(3);
        return nw.join('/');
    }
    getRelativeSiteUrl=function(url){
        var array = url.split('/');
        var nw=array.slice(3, array.length-1 );
        return nw.join('/');
    }
    getWopiEditUrl(url){
        var domainPart=this.getDomainPart(url);
        var site= getSite(url);
        var docid=''
        return `${domainPart}/:w:/r/sites/${site}/_layouts/15/Doc.aspx?sourcedoc=%7B${docid}%7D`;
        // https://epona.sharepoint.com/:w:/r/sites/221229/_layouts/15/Doc.aspx?sourcedoc=%7Bee0c3a26-33ba-40b5-b218-f5d7b127ac30%7D&wdPreviousSession=a4497126-e115-4384-b72f-28c0cfe1f1b5
    }
    getDomainPart(url){
        var array = url.split('/');
        var nw=array.slice(0, 3 );
        return nw.join('/');
          
    }
   getSite(url){
        var array = url.split('/');
        var nw=array[4];
        return nw;
          
    }
    getFileType =function(url){
        if(url){
            var idx=url.lastIndexOf('.');
            if(url.length>idx+2){
                return url.substring(idx+1);
            }
        }
    }
    getFileName(url) {
        if (url) {
            var a = url.split('/');
            return a[a.length - 1];
        }
        return 'document';
    }

    makeAbsoluteUrl = function (url) {
        if (url.startsWith('http')) {
            return url;
        }
        return this.getOrigin() + url;
    };
    getOrigin = function () {
        return `${location.protocol}//${location.host}`;
    };

    getWopIframeUrl = function (url,siteUrl, asPreview) {

        //var docUrl = docPropsl.absoluteUrl ? docPropsl.absoluteUrl : _spPageContextInfo.siteAbsoluteUrl + url;
        var tUrl;
        if (url) {

                tUrl = siteUrl + '/_layouts/15/WopiFrame.aspx?sourcedoc=' + encodeURIComponent(url) + '&action=';//
                if (asPreview) {
                    tUrl += 'embedview&amp;Embed=1';
                }
                else {
                    tUrl += 'edit&amp;Embed=1';
                }
        }
        return tUrl;

    };
    isPreviewAvailable = function (fileType) {
        return "doc;.docx;.dotx;.xlsx;.pptx;.pdf;.html;.aspx;.jpg;.png;.gif;.msg;.url;".indexOf(fileType.toLowerCase() + ";") > -1;
    };
    getIconClass(ext) {
        var t_ext=`.${ext}`;
        switch (t_ext) {
            case '.zip':
                return 'icon_zip';
            case '.doc':
            case '.docx':
                return 'icon_doc';
            case '.pdf':
                return 'icon_pdf';
            case '.txt':
                return 'icon_txt';
            case '.xls':
            case '.xlsx':
                return 'icon_xls';
            case '.ppt':
            case '.pptx':
                return 'icon_ppt';
            case '.msg':
                return 'icon_msg';
        }
        return 'icon_common';
    }
    createEvent=async function(transActionId){
        var url = 'https://graph.microsoft.com/v1.0/me/events';
        var json=this.getEventJson(transActionId)
        var tosend = JSON.stringify(json);
        // request options
        const options = {
            method: 'POST',
            body: tosend,
            headers: {
                'Content-Type': 'application/json'
                }
            }

        fetch(url, options)
            .then(res => res.json())
            .then(res => resolve( res))
            .catch(err => {
                if (err.name != 'AbortError') {
                }
                else {

                }
            });
    }
    getUTCDateTimeString(date){
        function padTo2Digits(num) {
            return num.toString().padStart(2, '0');
          }
          
         
        return (
            [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
            ].join('-') +
            'T' +
            [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
            ].join(':')
        );
          
  }
    getEventJson(transActionId){
        var d=new Date();
        var d2=new Date();
        d2.setMinutes(d2.getMinutes()+5);
        return {
            "subject": "Let's go for lunch",
            "body": {
              "contentType": "HTML",
              "content": "Does noon work for you?"
            },
            "start": {
                "dateTime": this.getUTCDateTimeString(d),
                "timeZone": "UTC"
            },
            "end": {
                "dateTime": this.getUTCDateTimeString(d2),
                "timeZone": "UTC"
            },
            "location":{
                "displayName":"Harry's Bar"
            },
            "attendees": [
              {
                "emailAddress": {
                  "address":"samanthab@contoso.onmicrosoft.com",
                  "name": "Samantha Booth"
                },
                "type": "required"
              }
            ],
            "allowNewTimeProposals": true,
            "transactionId":transActionId
          };
    }
    getRandomId=function(){
        return Math.random().toString(36).substring(2, 9);
    }
}
