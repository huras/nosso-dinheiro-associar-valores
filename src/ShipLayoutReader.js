class ShipLayoutReader {
  constructor() {
    this.animationCounter = 0;
    this.hasLoaded = false;
  }

  load(filepath, callback = undefined) {
    this.filepath = filepath;
    this.read(callback);
  }

  getTilesetByGID(gid) {
    let retorno = null;
    this.tilesets.map((tileset) => {
      // console.log(gid, tileset.firstgid <= gid, gid <= tileset.firstgid + (tileset.tilecount - 1), tileset);      
      if (tileset.imageLoaded) {
        if (
          tileset.firstgid <= gid &&
          gid <= tileset.firstgid + (tileset.tilecount - 1)
        ) {
          retorno = tileset;
        }
      }
    });

    return retorno;
  }

  getLayerByZIndex(zIndex) {
    let retorno = null;
    this.layers.map((layer) => {
      if (this.layers.properties['z-index'] == zIndex)
        retorno = layer;
    });

    return retorno;
  }

  getProperties(objectToAttach) {
    var properties = [];
    var propertyTags = objectToAttach.querySelector('properties');
    if (propertyTags) {
      propertyTags = propertyTags.querySelectorAll('property')
    } else {
      propertyTags = [];
    }

    for (var propTag of propertyTags) {
      const key = propTag.getAttribute("name");
      const value = JSON.parse(propTag.getAttribute("value"));
      properties[key] = value;
    }
    return properties;
  }

  getObjects(objectgroup) {

  }

  read(callback = undefined) {
    // For reading .txt file code block
    var afterLoad = (fileString) => {
      var parser, xmlDoc;

      parser = new DOMParser();
      xmlDoc = parser.parseFromString(fileString, "text/xml");

      // Read Stages
      this.challenges = [];
      this.questions = [];
      var objGs = xmlDoc.querySelectorAll("objectgroup");
      console.log(objGs);
      for (var idx = 0; idx < objGs.length; idx++) {
        var objectgroup = objGs[idx];
        var newStage = {
          name: null,
          objects: []
        };

        newStage.name = objectgroup.getAttribute('name');
        newStage.properties = this.getProperties(objectgroup);

        for (var object of objectgroup.querySelectorAll("object")) {
          var tempType = object.getAttribute("type");
          var tempX = parseInt(object.getAttribute("x"));
          var tempY = parseInt(object.getAttribute("y"));
          var tempW = parseInt(object.getAttribute("width"));
          var tempH = parseInt(object.getAttribute("height"));

          var newObject = {
            gid: parseInt(object.getAttribute("gid")),
            type: tempType,
            x: tempX + tempW * 0.5,
            y: 1600 - tempY,
            w: tempW,
            h: tempH,
            name: object.getAttribute("name"),
            // collider: newPolyColider,
            properties: this.getProperties(object)
          };

          newStage.objects.push(newObject);
        }

        switch (newStage.properties.type) {
          case 'challenge':
            this.challenges.push(newStage);
            break;

          case 'question':
            this.questions.push(newStage);
            break;

          default:
            break;
        }
      }

      this.hasLoaded = true;


      if (callback)
        callback();

      // console.log(this.layers);
      // console.log(xmlDoc);

    }

    var stageData = `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.0" orientation="orthogonal" renderorder="right-down" width="15" height="100" tilewidth="16" tileheight="16" nextobjectid="874">
 <tileset firstgid="1" name="31363" tilewidth="16" tileheight="16" tilecount="28" columns="7">
  <image source="../../../../../../../../Trabalho/Prefeitura Carmopolis/Caixa de areia/stage-layout.png" trans="ff00ff" width="112" height="64"/>
 </tileset>
 <tileset firstgid="29" name="Clouds" tilewidth="48" tileheight="32" tilecount="4" columns="2">
  <image source="../../../../../../../../Trabalho/Prefeitura Carmopolis/Caixa de areia/cloud-tileset.png" trans="ff0004" width="96" height="64"/>
 </tileset>
 <tileset firstgid="33" name="31363" tilewidth="16" tileheight="16" tilecount="28" columns="7">
  <image source="../../../../../../../../Trabalho/Prefeitura Carmopolis/Caixa de areia/stage-layout.png" trans="ff00ff" width="112" height="64"/>
 </tileset>
 <layer name="Camada de Tiles 1" width="15" height="100" visible="0">
  <data encoding="csv">
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0
</data>
 </layer>
 <objectgroup name="Challenge 2" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="2"/>
   <property name="crystals" type="int" value="6"/>
   <property name="hardness" type="float" value="1"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="182" gid="15" x="0" y="1072" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="183" gid="30" x="176" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="184" gid="1" x="192" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="185" gid="1" x="192" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="186" gid="1" x="192" y="1536" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="188" gid="33" x="112" y="1248" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="189" gid="30" x="96" y="1152" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="191" gid="33" x="112" y="1296" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="192" gid="33" x="112" y="1200" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="245" gid="34" x="112" y="1104" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 3" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="3"/>
   <property name="crystals" type="int" value="9"/>
   <property name="hardness" type="float" value="1.5"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="193" gid="15" x="0" y="752" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="194" gid="30" x="176" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="195" gid="1" x="192" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="196" gid="1" x="192" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="197" gid="1" x="192" y="1536" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="199" gid="33" x="112" y="1248" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="200" gid="30" x="96" y="1152" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="202" gid="33" x="112" y="1296" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="203" gid="33" x="112" y="1200" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="204" gid="33" x="32" y="944" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="205" gid="33" x="32" y="896" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="206" gid="33" x="32" y="992" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="207" gid="30" x="16" y="848" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="244" gid="34" x="32" y="800" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 3 A" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="3"/>
   <property name="crystals" type="int" value="9"/>
   <property name="hardness" type="float" value="1.5"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="784" gid="15" x="0" y="748" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="785" gid="30" x="176" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="786" gid="1" x="192" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="787" gid="1" x="192" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="788" gid="1" x="192" y="1536" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="789" gid="33" x="33" y="1225" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="790" gid="30" x="17" y="1129" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="791" gid="33" x="33" y="1273" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="792" gid="33" x="33" y="1177" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="793" gid="33" x="193" y="926" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="794" gid="33" x="193" y="878" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="795" gid="33" x="193" y="974" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="796" gid="30" x="177" y="830" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="797" gid="34" x="193" y="782" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 4" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="2"/>
   <property name="crystals" type="int" value="7"/>
   <property name="hardness" type="float" value="1.5"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="214" gid="15" x="0" y="1056" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="215" gid="30" x="176" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="216" gid="1" x="192" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="217" gid="1" x="192" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="218" gid="1" x="192" y="1536" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="220" gid="33" x="32" y="1248" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="221" gid="30" x="16" y="1152" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="223" gid="33" x="32" y="1296" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="224" gid="33" x="32" y="1200" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="243" gid="34" x="32" y="1104" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="307" gid="33" x="112" y="1360" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 4 A" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="2"/>
   <property name="crystals" type="int" value="7"/>
   <property name="hardness" type="float" value="4"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="851" gid="15" x="0" y="1056" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="852" gid="30" x="176" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="853" gid="1" x="36" y="1580" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="854" gid="1" x="192" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="855" gid="1" x="116" y="1532" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="856" gid="1" x="116" y="1240" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="857" gid="30" x="180" y="1144" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="858" gid="1" x="32" y="1296" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="859" gid="1" x="196" y="1184" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="860" gid="2" x="196" y="1096" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="861" gid="1" x="112" y="1360" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 5" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="3"/>
   <property name="crystals" type="int" value="7"/>
   <property name="hardness" type="float" value="2"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="230" gid="15" x="0" y="1040" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="231" gid="30" x="176" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="232" gid="1" x="192" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="233" gid="1" x="192" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="234" gid="1" x="192" y="1536" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="235" gid="1" x="176" y="1392" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="236" gid="33" x="64" y="1232" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="237" gid="30" x="96" y="1296" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="238" gid="33" x="144" y="1344" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="240" gid="33" x="32" y="1184" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="241" gid="30" x="16" y="1136" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="242" gid="2" x="32" y="1088" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 5 A" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="3"/>
   <property name="crystals" type="int" value="7"/>
   <property name="hardness" type="float" value="2"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="798" gid="15" x="0" y="656" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="799" gid="30" x="176" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="800" gid="1" x="192" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="801" gid="1" x="192" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="802" gid="1" x="192" y="1536" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="803" gid="1" x="176" y="1392" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="804" gid="33" x="64" y="1232" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="806" gid="33" x="144" y="1344" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="807" gid="33" x="32" y="1184" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="808" gid="30" x="16" y="1136" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="810" gid="1" x="104" y="1288" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="811" gid="2" x="192" y="752" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="812" gid="30" x="176" y="800" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="813" gid="1" x="120" y="936" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="814" gid="1" x="160" y="888" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="815" gid="1" x="80" y="988" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="816" gid="1" x="192" y="832" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="817" gid="1" x="48" y="1052" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 6" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="2"/>
   <property name="crystals" type="int" value="9"/>
   <property name="hardness" type="float" value="2.5"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="247" gid="15" x="0" y="1040" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="248" gid="30" x="176" y="1443" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="249" gid="1" x="192" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="250" gid="1" x="192" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="251" gid="1" x="192" y="1536" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="252" gid="1" x="167" y="1383" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="253" gid="33" x="56" y="1224" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="255" gid="33" x="139" y="1345" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="256" gid="33" x="32" y="1181" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="257" gid="30" x="16" y="1136" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="258" gid="2" x="32" y="1088" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="259" gid="33" x="85" y="1264" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="260" gid="33" x="110" y="1303" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 7" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="4"/>
   <property name="crystals" type="int" value="12"/>
   <property name="hardness" type="float" value="4"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="261" gid="15" x="0" y="560" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="262" gid="30" x="176" y="1443" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="263" gid="1" x="192" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="264" gid="1" x="192" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="265" gid="1" x="192" y="1536" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="266" gid="1" x="167" y="1383" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="267" gid="33" x="56" y="1224" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="268" gid="33" x="139" y="1345" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="270" gid="30" x="16" y="1184" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="272" gid="33" x="85" y="1264" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="273" gid="33" x="110" y="1303" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="274" gid="30" x="176" y="896" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="275" gid="33" x="192" y="976" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="276" gid="33" x="192" y="928" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="277" gid="33" x="192" y="1024" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="278" gid="34" x="32" y="596" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="279" gid="30" x="16" y="644" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="280" gid="33" x="32" y="672" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 8" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="3"/>
   <property name="crystals" type="int" value="12"/>
   <property name="hardness" type="float" value="6"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="281" gid="15" x="0" y="480" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="283" gid="1" x="192" y="1556" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="286" gid="1" x="167" y="1385" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="287" gid="33" x="56" y="1230" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="288" gid="33" x="139" y="1333" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="289" gid="30" x="16" y="1199" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="290" gid="33" x="85" y="1259" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="291" gid="33" x="110" y="1293" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="295" gid="33" x="192" y="1033" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="296" gid="34" x="192" y="496" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="297" gid="30" x="176" y="544" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="298" gid="33" x="192" y="572" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="301" gid="33" x="56" y="833" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="302" gid="30" x="16" y="790" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="306" gid="33" x="128" y="920" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 8 B" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="3"/>
   <property name="crystals" type="int" value="8"/>
   <property name="hardness" type="float" value="6"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="766" gid="15" x="0" y="800" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="767" gid="1" x="32" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="768" gid="1" x="32" y="1536" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="769" gid="33" x="96" y="1232" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="770" gid="33" x="32" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="771" gid="30" x="16" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="772" gid="33" x="144" y="1264" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="773" gid="33" x="192" y="1296" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="775" gid="34" x="192" y="832" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="779" gid="30" x="176" y="880" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="781" gid="1" x="52" y="1208" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="782" gid="1" x="32" y="1176" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="783" gid="30" x="16" y="1136" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 8 A" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="3"/>
   <property name="crystals" type="int" value="3"/>
   <property name="hardness" type="float" value="7"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="735" gid="15" x="0" y="752" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="736" gid="1" x="192" y="1556" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="740" gid="30" x="176" y="1093" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="742" gid="33" x="112" y="1408" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="744" gid="34" x="36" y="805" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="745" gid="30" x="20" y="853" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="750" gid="1" x="32" y="1280" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="751" gid="30" x="101" y="971" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 1" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="1"/>
   <property name="crystals" type="int" value="4"/>
   <property name="hardness" type="float" value="0"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="24" gid="15" x="0" y="1360" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="34" gid="30" x="96" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="36" gid="1" x="112" y="1600" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="37" gid="1" x="112" y="1504" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="39" gid="1" x="112" y="1548" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="246" gid="34" x="112" y="1392" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="466" gid="1" x="112" y="1472" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 1 D" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="2"/>
   <property name="crystals" type="int" value="7"/>
   <property name="hardness" type="float" value="0"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="754" gid="15" x="0" y="1024" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="755" gid="30" x="16" y="1424" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="756" gid="1" x="32" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="757" gid="1" x="32" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="758" gid="1" x="32" y="1532" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="760" gid="1" x="32" y="1456" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="761" gid="30" x="96" y="1168" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="762" gid="2" x="112" y="1120" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="763" gid="1" x="88" y="1272" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="764" gid="1" x="44" y="1328" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="765" gid="1" x="112" y="1208" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 1 A" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="1"/>
   <property name="crystals" type="int" value="4"/>
   <property name="hardness" type="float" value="0"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="710" gid="15" x="0" y="1360" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="711" gid="30" x="177" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="712" gid="1" x="96" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="713" gid="1" x="161" y="1519" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="714" gid="1" x="129" y="1551" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="715" gid="34" x="193" y="1392" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="716" gid="1" x="193" y="1487" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 1 B" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="1"/>
   <property name="crystals" type="int" value="6"/>
   <property name="hardness" type="float" value="2"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="717" gid="15" x="0" y="1168" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="718" gid="30" x="16" y="1248" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="719" gid="1" x="68" y="1584" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="720" gid="1" x="132" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="721" gid="1" x="100" y="1552" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="722" gid="34" x="32" y="1200" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
  <object id="723" gid="1" x="164" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="724" gid="1" x="112" y="1348" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="725" gid="1" x="192" y="1456" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Challenge 1 C">
  <properties>
   <property name="checkpoints" type="int" value="1"/>
   <property name="crystals" type="int" value="0"/>
   <property name="hardness" type="float" value="2"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;challenge&quot;"/>
  </properties>
  <object id="726" gid="15" x="0" y="1371" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="727" gid="30" x="0" y="1467" width="48" height="32">
   <properties>
    <property name="type" value="&quot;checkpoint&quot;"/>
   </properties>
  </object>
  <object id="753" gid="2" x="16" y="1423" width="16" height="16">
   <properties>
    <property name="type" value="&quot;pink-crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Question 1" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="0"/>
   <property name="crystals" type="int" value="0"/>
   <property name="hardness" type="float" value="0"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;question&quot;"/>
  </properties>
  <object id="308" gid="15" x="0" y="1360" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="532" gid="30" x="0" y="1442" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
  <object id="533" gid="30" x="100" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
  <object id="534" gid="30" x="192" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Question 2" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="0"/>
   <property name="crystals" type="int" value="0"/>
   <property name="hardness" type="float" value="0"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;question&quot;"/>
  </properties>
  <object id="539" gid="15" x="0" y="1312" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="540" gid="30" x="0" y="1488" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
  <object id="541" gid="30" x="100" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
  <object id="542" gid="30" x="191" y="1488" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Question 3" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="0"/>
   <property name="crystals" type="int" value="0"/>
   <property name="hardness" type="float" value="0"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;question&quot;"/>
  </properties>
  <object id="706" gid="15" x="0" y="1312" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="707" gid="30" x="189" y="1392" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
  <object id="708" gid="30" x="100" y="1440" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
  <object id="709" gid="30" x="0" y="1392" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Question 4" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="0"/>
   <property name="crystals" type="int" value="0"/>
   <property name="hardness" type="float" value="0"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;question&quot;"/>
  </properties>
  <object id="549" gid="15" x="0" y="1392" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="550" gid="30" x="32" y="1584" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
  <object id="551" gid="30" x="176" y="1584" width="48" height="32">
   <properties>
    <property name="type" value="&quot;result-option&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Reward 0" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="0"/>
   <property name="crystals" type="int" value="70"/>
   <property name="hardness" type="float" value="0"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;reward&quot;"/>
  </properties>
  <object id="314" gid="15" x="0" y="1136" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="316" gid="1" x="112" y="1198" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="324" gid="1" x="112" y="1214" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="325" gid="1" x="112" y="1182" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="328" gid="1" x="144" y="1214" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="329" gid="1" x="144" y="1182" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="335" gid="1" x="144" y="1198" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="338" gid="1" x="176" y="1214" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="339" gid="1" x="176" y="1182" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="345" gid="1" x="176" y="1198" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="348" gid="1" x="208" y="1214" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="349" gid="1" x="208" y="1182" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="355" gid="1" x="208" y="1198" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="356" gid="1" x="16" y="1198" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="367" gid="1" x="80" y="1198" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="374" gid="1" x="48" y="1182" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="379" gid="1" x="16" y="1214" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="380" gid="1" x="80" y="1214" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="387" gid="1" x="80" y="1182" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="391" gid="1" x="48" y="1214" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="392" gid="1" x="16" y="1182" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="393" gid="1" x="48" y="1198" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="469" gid="1" x="176" y="1344" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="470" gid="1" x="16" y="1328" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="471" gid="1" x="48" y="1328" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="472" gid="1" x="144" y="1312" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="473" gid="1" x="208" y="1312" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="474" gid="1" x="112" y="1312" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="475" gid="1" x="16" y="1312" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="476" gid="1" x="112" y="1344" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="477" gid="1" x="176" y="1328" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="478" gid="1" x="48" y="1312" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="479" gid="1" x="112" y="1328" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="480" gid="1" x="208" y="1328" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="481" gid="1" x="80" y="1312" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="482" gid="1" x="80" y="1344" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="483" gid="1" x="144" y="1328" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="484" gid="1" x="80" y="1328" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="485" gid="1" x="176" y="1312" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="486" gid="1" x="208" y="1344" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="487" gid="1" x="144" y="1344" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="488" gid="1" x="16" y="1344" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="489" gid="1" x="48" y="1344" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="490" gid="1" x="144" y="1503" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="491" gid="1" x="176" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="492" gid="1" x="112" y="1471" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="493" gid="1" x="80" y="1471" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="494" gid="1" x="16" y="1503" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="495" gid="1" x="48" y="1471" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="496" gid="1" x="208" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="497" gid="1" x="112" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="498" gid="1" x="208" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="499" gid="1" x="144" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="500" gid="1" x="48" y="1456" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="501" gid="1" x="48" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="502" gid="1" x="80" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="503" gid="1" x="80" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="504" gid="1" x="48" y="1360" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="505" gid="1" x="208" y="1503" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="506" gid="1" x="80" y="1360" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="507" gid="1" x="80" y="1503" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="508" gid="1" x="48" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="509" gid="1" x="208" y="1456" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="510" gid="1" x="112" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="511" gid="1" x="16" y="1360" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="512" gid="1" x="176" y="1360" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="513" gid="1" x="16" y="1471" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="514" gid="1" x="144" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="515" gid="1" x="16" y="1456" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="516" gid="1" x="112" y="1503" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="517" gid="1" x="144" y="1471" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="518" gid="1" x="208" y="1471" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="519" gid="1" x="176" y="1456" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="520" gid="1" x="16" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="521" gid="1" x="80" y="1456" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="522" gid="1" x="16" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="523" gid="1" x="48" y="1503" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="524" gid="1" x="208" y="1360" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="525" gid="1" x="144" y="1456" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="526" gid="1" x="112" y="1360" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="527" gid="1" x="176" y="1471" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="528" gid="1" x="144" y="1360" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="529" gid="1" x="176" y="1488" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="530" gid="1" x="112" y="1456" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="531" gid="1" x="176" y="1503" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Reward 1" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="0"/>
   <property name="crystals" type="int" value="70"/>
   <property name="hardness" type="float" value="0"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;reward&quot;"/>
  </properties>
  <object id="553" gid="15" x="0" y="1216" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="638" gid="1" x="64" y="1568" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="639" gid="1" x="16" y="1568" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="654" gid="1" x="40" y="1568" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="659" gid="1" x="32" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="660" gid="1" x="56" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="661" gid="1" x="80" y="1520" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="662" gid="1" x="72" y="1468" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="663" gid="1" x="96" y="1468" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="664" gid="1" x="120" y="1468" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="665" gid="1" x="104" y="1421" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="666" gid="1" x="128" y="1421" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="667" gid="1" x="152" y="1421" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="668" gid="1" x="144" y="1391" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="669" gid="1" x="168" y="1391" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="670" gid="1" x="192" y="1391" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="671" gid="1" x="156" y="1364" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="672" gid="1" x="180" y="1364" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="673" gid="1" x="204" y="1364" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="674" gid="1" x="150" y="1333" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="675" gid="1" x="174" y="1333" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="676" gid="1" x="198" y="1333" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="677" gid="3" x="176" y="1280" width="16" height="16">
   <properties>
    <property name="type" value="&quot;heart-crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
 <objectgroup name="Reward 2" visible="0">
  <properties>
   <property name="checkpoints" type="int" value="0"/>
   <property name="crystals" type="int" value="70"/>
   <property name="hardness" type="float" value="0"/>
   <property name="treatlevel" type="float" value="0"/>
   <property name="type" value="&quot;reward&quot;"/>
  </properties>
  <object id="678" gid="15" x="0" y="1344" width="240" height="16">
   <properties>
    <property name="type" value="&quot;spacing&quot;"/>
   </properties>
  </object>
  <object id="700" gid="3" x="112" y="1473" width="16" height="16">
   <properties>
    <property name="type" value="&quot;heart-crystal&quot;"/>
   </properties>
  </object>
  <object id="701" gid="1" x="96" y="1504" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="702" gid="1" x="160" y="1552" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="703" gid="1" x="64" y="1552" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
  <object id="704" gid="1" x="128" y="1504" width="16" height="16">
   <properties>
    <property name="type" value="&quot;crystal&quot;"/>
   </properties>
  </object>
 </objectgroup>
</map>

    `;
    // TxtReader.loadTextFile(this.filepath, );

    afterLoad(stageData);
  }
}