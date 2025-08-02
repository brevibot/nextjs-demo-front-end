const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const outDir = path.join(__dirname, '..', 'out');
const webInfDir = path.join(outDir, 'WEB-INF');
const webXmlPath = path.join(webInfDir, 'web.xml');

const webXmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <display-name>Next.js Static Dashboard</display-name>
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
</web-app>`;

mkdirp.sync(webInfDir);
fs.writeFileSync(webXmlPath, webXmlContent, 'utf8');
console.log('Successfully created WEB-INF/web.xml for WAR packaging.');
