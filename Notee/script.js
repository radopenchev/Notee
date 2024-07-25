
window.search_mode = "any used word"; 
var note_name = window.location.href.split("/").slice(-1).toString().split("#")[0];
document.getElementsByClassName("note-title-text")[0].textContent = note_name;
var labels_search_list = [];

 function switchTheme(elem){
    var current_theme = document.getElementsByTagName("html")[0].getAttribute("data-theme");
    if (current_theme == null || current_theme == "light"){
      document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
      elem.getElementsByTagName("svg")[0].getElementsByTagName("path")[0].style.display = "block";
      elem.getElementsByTagName("svg")[0].getElementsByTagName("path")[1].style.display = "none";
      elem.title = "Switch To Light Theme";
      var settings = JSON.parse(document.getElementById("info-saver").textContent);
      settings["theme"] = "dark";
      document.getElementById("info-saver").textContent = JSON.stringify(settings);
    }else{
      document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
      elem.getElementsByTagName("svg")[0].getElementsByTagName("path")[0].style.display = "none";
      elem.getElementsByTagName("svg")[0].getElementsByTagName("path")[1].style.display = "block";
      elem.title = "Switch To Dark Theme";
      var settings = JSON.parse(document.getElementById("info-saver").textContent);
      settings["theme"] = "light";
      document.getElementById("info-saver").textContent = JSON.stringify(settings);
    }
  }
  function setThemeOnLaunch(){
    var settings = JSON.parse(document.getElementById("info-saver").textContent);
    var elem = document.getElementsByClassName("menu")[0].getElementsByClassName("item")[1];

    if (settings["theme"] == "light"){
      document.getElementsByTagName("html")[0].setAttribute("data-theme", "light");
      elem.getElementsByTagName("svg")[0].getElementsByTagName("path")[0].style.display = "none";
      elem.getElementsByTagName("svg")[0].getElementsByTagName("path")[1].style.display = "block";
      elem.title = "Switch To Dark Theme";
    }else{
      document.getElementsByTagName("html")[0].setAttribute("data-theme", "dark");
      elem.getElementsByTagName("svg")[0].getElementsByTagName("path")[0].style.display = "block";
      elem.getElementsByTagName("svg")[0].getElementsByTagName("path")[1].style.display = "none";
      elem.title = "Switch To Light Theme";
    }
  }
  async function save(){
    while (document.getElementById("notif-list").children.length != 0){
      await sleep(500);
    }
    var htmlContent = document.getElementsByTagName("html")[0].innerHTML;
    htmlContent = ["<!DOCTYPE html>\n"+"<html lang=\"en\">\n"+htmlContent+"\n</html>"];
    var bl = new Blob(htmlContent, {type: "text/html"});
    var a = document.createElement("a");
    a.href = URL.createObjectURL(bl);
    a.download = note_name;
    a.hidden = true;
    document.body.appendChild(a);
    a.innerHTML = "#Freedom";
    a.click();
    a.remove();}

      function lookForLabelsInNote(noteLabelsTextContent){ 
        var score = 0;
        for (let searchLabel of labels_search_list){
          if (noteLabelsTextContent.indexOf(searchLabel) != -1){
            score++;
          }else{
            score--;
          }
        }
        if (score >= labels_search_list.length){
          return true;
        }else{
          return false;
        }
      }
      function search(){
        var value = document.getElementById("searchInput").value.trim();
        for (let note of document.getElementsByClassName("note")){

          var texts = note.getAttribute("title")
          + note.getElementsByClassName("title")[0].textContent
          + note.getElementsByClassName("content")[0].textContent
          + note.getElementsByClassName("note-labels")[0].textContent;

          var words = value.split(" ");
          var score = 0;
          for (let word of words){
            if (word.trim() != "" || value == ""){
              if (texts.toLowerCase().indexOf(word.toLowerCase()) != -1){
                score++
              }else{
                if (window.search_mode == "all used words"){
                  score--
                }
              }
            }
          }
          
          if (window.search_mode == "all used words"){
            if (score == words.length && lookForLabelsInNote(note.getElementsByClassName("note-labels")[0].textContent)){
              note.style.display = "block";
            }else{
            note.style.display = "none";
            }
          }else{
            if (score > 0 && lookForLabelsInNote(note.getElementsByClassName("note-labels")[0].textContent)){
              note.style.display = "block";
            }else{
              note.style.display = "none";
            }
          }
        }
      }
      function searchModeSwitcher(){
        if (window.search_mode == "any used word"){
          window.search_mode = "all used words";
          document.getElementById("searchModeButton").title = "Search mode | all used words must be in note";
          document.getElementById("searchModeButton").textContent = "+";
        }else{
          window.search_mode = "any used word";
          document.getElementById("searchModeButton").title = "Search mode | any used word be in note";
          document.getElementById("searchModeButton").textContent = "*";
        }
      }

      function addLabel(elem){
        var label_text = prompt("Enter label");
        if (label_text.trim() != "" && label_text.indexOf("#") == -1){
          var label = document.createElement("a");
          label.className = "label";
          label.textContent = "#"+label_text;
          label.title = "Click to remove";
          label.setAttribute("onclick", "removeLabel(this);");
          elem.parentElement.parentElement.parentElement.getElementsByClassName("note-labels")[0].appendChild(label);
         
        } 
        checkLabels();

      }
      function removeLabel(elem){
        var confirm = prompt("Confirm label deleting with \"yes\"");
        if (confirm == "yes"){
          elem.remove();
          checkLabels();
        }
      }
      function addLabelToSearch(elem){
        if (elem.classList.contains("active-label") == false){
          labels_search_list.push(elem.textContent);
          elem.classList.add("active-label");
        }else{
          labels_search_list.pop(elem.textContent);
          elem.classList.remove("active-label");
        }
        search();
      }

      function checkLabels(){
        labels_search_list = [];
        var labels = Array()
        for (let note of document.getElementsByClassName("note")){
          try{
            var note_labels = note.getElementsByClassName("note-labels")[0].textContent;
            var splited_note_label = note_labels.split("#")
            for (let label of splited_note_label){
              labels.push(label);
            }
          }catch(err){}
        }
        function onlyUnique(value, index, self) {
          return self.indexOf(value) === index;
        }
        
        document.getElementsByClassName("labels-list")[0].innerHTML = "";

        var unique_labels = labels.filter(onlyUnique);
        for (let label of unique_labels){
          if (label.trim() != ""){
            var label_elem = document.createElement("a");
            label_elem.className = "label";
            label_elem.textContent = "#"+label;
            label_elem.setAttribute("onclick", "addLabelToSearch(this);");
            document.getElementsByClassName("labels-list")[0].appendChild(label_elem);
          }
        }
      }
      checkLabels();





      function getLink(){
        return prompt("Enter Link or hashtag or point to a note like #note(n), #note3, #note20");
      }
      function getImage(){
        return prompt("Enter image link");
      }
      function copyCode(elem){
        navigator.clipboard.writeText(elem.parentElement.innerText);
      }

      function getMakeListContent(){
        var value = prompt("Enter List items, seperate them with ## or press enter to create list");
        if (value != null){
          var list_items = value.split("##").map(element => element.trim());
          var the_html = "<ul>";
          for (let item of list_items){
            the_html += "<li>"+item+"</li>";
          }
          the_html += "</ul>";
          return the_html;
        }else{
          return "";
        }
      }
      function changeBlockAlignment(){
        var elem = window.getSelection().anchorNode.parentElement;
        if (elem.style.direction == "ltr"){
          elem.style.direction = "rtl";
        } else if (elem.style.direction == "rtl"){
          elem.style.direction = "ltr";
        }else{
          elem.style.direction = "ltr";
        }
      }

      function saveNotesToLocalStorage() {
        var notes = [];
        for (let note of document.getElementsByClassName("note")) {
          var noteData = {
            id: note.id,
            title: note.getElementsByClassName("title")[0].textContent,
            content: note.getElementsByClassName("content")[0].textContent,
            labels: note.getElementsByClassName("note-labels")[0].textContent,
            
            created: note.title.split("Modified")[0],
            modified: note.title.split("Modified: ")[1]
            
          };
          notes.push(noteData);
        }
        localStorage.setItem("notes", JSON.stringify(notes));
      }
      

      function loadNotesFromLocalStorage() {
        var notesData = localStorage.getItem("notes");
        if (notesData) {
          var notes = JSON.parse(notesData);
          for (let noteData of notes) {
            var new_note = document.createElement("section");
            new_note.className = "note";
            new_note.id = noteData.id;
      
            var note_title = document.createElement("h1");
            note_title.className = "title";
            note_title.textContent = noteData.title;
            new_note.appendChild(note_title);
      
            var note_content = document.createElement("div");
            note_content.className = "content";
            note_content.textContent = noteData.content;
            new_note.appendChild(note_content);
      
            var note_labels = document.createElement("div");
            note_labels.className = "note-labels";
            note_labels.textContent = noteData.labels;
            new_note.appendChild(note_labels);
      
            var note_footer = document.createElement("div");
            note_footer.className = "note-footer";
            var edit_button = document.createElement("button");
            edit_button.className = "action-button";
            edit_button.textContent = "Start Editing Note";
            edit_button.setAttribute("onclick", "editNote(this);");
            note_footer.appendChild(edit_button);
            var delete_button = document.createElement("button");
            delete_button.className = "action-button delete";
            delete_button.textContent = "Delete";
            delete_button.setAttribute("onclick", "deleteNote(this);");
            note_footer.appendChild(delete_button);
            new_note.appendChild(note_footer);
      
            document.getElementById("notes-list").appendChild(new_note);
          }
        }
      }

      window.addEventListener("load", function() {
        loadNotesFromLocalStorage();
      });



      async function editNote(elem){
        
        if (elem.parentElement.parentElement.getAttribute("on-edit-mode") == null){
          elem.textContent = "Submit Edit";
          elem.parentElement.parentElement.setAttribute("on-edit-mode", true);

          for (let child of elem.parentElement.parentElement.children){
            if (child.classList.contains("content") || child.classList.contains("title")){
              
                child.setAttribute("contenteditable", true);

                if (child.classList.contains("content")){
                  child.style = "max-height: 300px; overflow-y: auto;";
                }
                
            } else if (child.classList.contains("note-footer")){

              var edit_container = document.createElement("div");
              edit_container.className = "edit-container";
              child.appendChild(edit_container);

              var edit_bold_button = document.createElement("button");
              edit_bold_button.className = "action-button";
              edit_bold_button.textContent = "Bold";
              edit_bold_button.title = "Make selected text Bold";
              edit_bold_button.setAttribute("edit-mode-button", true);
              edit_bold_button.setAttribute("onclick", "document.execCommand('bold', false, null);");
              edit_container.appendChild(edit_bold_button);

              var edit_italic_button = document.createElement("button");
              edit_italic_button.className = "action-button";
              edit_italic_button.textContent = "Italic";
              edit_italic_button.title = "Make selected text Italic";
              edit_italic_button.setAttribute("edit-mode-button", true);
              edit_italic_button.setAttribute("onclick", "document.execCommand('italic', false, null);");
              edit_container.appendChild(edit_italic_button);

              var edit_underline_button = document.createElement("button");
              edit_underline_button.className = "action-button";
              edit_underline_button.textContent = "Underline";
              edit_underline_button.title = "Make selected text Underlined";
              edit_underline_button.setAttribute("edit-mode-button", true);
              edit_underline_button.setAttribute("onclick", "document.execCommand('underline', false, null)");
              edit_container.appendChild(edit_underline_button);

              var edit_h1_button = document.createElement("button");
              edit_h1_button.className = "action-button";
              edit_h1_button.textContent = "Header 1";
              edit_h1_button.title = "Make selected text large header";
              edit_h1_button.setAttribute("edit-mode-button", true);
              edit_h1_button.setAttribute("onclick", "document.execCommand('formatBlock', false, '<h1>')");
              edit_container.appendChild(edit_h1_button);

              var edit_h2_button = document.createElement("button");
              edit_h2_button.className = "action-button";
              edit_h2_button.textContent = "Header 2";
              edit_h2_button.title = "Make selected text Medium header";
              edit_h2_button.setAttribute("edit-mode-button", true);
              edit_h2_button.setAttribute("onclick", "document.execCommand('formatBlock', false, '<h2>')");
              edit_container.appendChild(edit_h2_button);

              var edit_h3_button = document.createElement("button");
              edit_h3_button.className = "action-button";
              edit_h3_button.textContent = "Header 3";
              edit_h3_button.title = "Make selected text small header";
              edit_h3_button.setAttribute("edit-mode-button", true);
              edit_h3_button.setAttribute("onclick", "document.execCommand('formatBlock', false, '<h3>')");
              edit_container.appendChild(edit_h3_button);

              var edit_p_button = document.createElement("button");
              edit_p_button.className = "action-button";
              edit_p_button.textContent = "Paragraph";
              edit_p_button.title = "Make selected text simple paragraph";
              edit_p_button.setAttribute("edit-mode-button", true);
              edit_p_button.setAttribute("onclick", "document.execCommand('formatBlock', false, '<p>')");
              edit_container.appendChild(edit_p_button);

              var edit_anchor_button = document.createElement("button");
              edit_anchor_button.className = "action-button";
              edit_anchor_button.textContent = "Insert Link";
              edit_anchor_button.title = "Turn selected text to link or hashtag";
              edit_anchor_button.setAttribute("edit-mode-button", true);
              edit_anchor_button.setAttribute("onclick", "document.execCommand('createLink', false, getLink())");
              edit_container.appendChild(edit_anchor_button);

              var edit_image_button = document.createElement("button");
              edit_image_button.className = "action-button";
              edit_image_button.textContent = "Insert Image";
              edit_image_button.title = "Insert image in cursor position";
              edit_image_button.setAttribute("edit-mode-button", true);
              edit_image_button.setAttribute("onclick", "document.execCommand('insertImage', false, getImage())");
              edit_container.appendChild(edit_image_button);

          

              var edit_insert_list_button = document.createElement("button");
              edit_insert_list_button.className = "action-button";
              edit_insert_list_button.textContent = "Insert list";
              edit_insert_list_button.title = "Insert a list of items";
              edit_insert_list_button.setAttribute("onclick", "document.execCommand('insertHTML', false, getMakeListContent());");
              edit_container.appendChild(edit_insert_list_button);

              var edit_align_block_button = document.createElement("button");
              edit_align_block_button.className = "action-button";
              edit_align_block_button.textContent = "Alignment";
              edit_align_block_button.title = "Align text block  to left or right";
              edit_align_block_button.setAttribute("onclick", "changeBlockAlignment()");
              edit_container.appendChild(edit_align_block_button);

              var edit_add_label_button = document.createElement("button");
              edit_add_label_button.className = "action-button";
              edit_add_label_button.textContent = "Add label";
              edit_add_label_button.title = "Add new label to group note";
              edit_add_label_button.setAttribute("onclick", "addLabel(this);");
              edit_container.appendChild(edit_add_label_button);



            }
            
          }
          var note_id = elem.parentElement.parentElement.id
        
        }else{

          elem.parentElement.parentElement.removeAttribute("on-edit-mode");

          var datetime = new Date();
          var datetime_string = datetime.toString();
          var created = elem.parentElement.parentElement.title.split("Modified")[0];
          elem.parentElement.parentElement.title = created + "Modified: "+ datetime_string;
          saveImagesToLocalStorage(note_id, elem.parentElement.parentElement);
          elem.textContent = "Edit Note";
          for (let child of elem.parentElement.parentElement.children){
            child.setAttribute("contenteditable", false);

            if (child.classList.contains("note-footer")){
              child.getElementsByClassName("edit-container")[0].remove();
            }
            if (child.classList.contains("content")){
              child.style = "";
            }

          }
          
        }
        saveNotesToLocalStorage();
      }
      function saveImagesToLocalStorage(noteId, noteElement) {
        var images = noteElement.querySelectorAll('.content img');
        var imageSrcArray = [];
      
        images.forEach(function (image) {
          imageSrcArray.push(image.src);
        });
      
        localStorage.setItem('note_images_' + noteId, JSON.stringify(imageSrcArray));
      }
      
      function loadImagesFromLocalStorage(noteId, noteElement) {
        var savedImages = localStorage.getItem('note_images_' + noteId);
        if (savedImages) {
          savedImages = JSON.parse(savedImages);
          var contentElement = noteElement.querySelector('.content');
      
          savedImages.forEach(function (imageSrc) {
            var imageElement = document.createElement('img');
            imageElement.src = imageSrc;
            contentElement.appendChild(imageElement);
          });
        }
      }
      
      function saveNoteImages(noteId) {
        var noteElement = document.getElementById(noteId);
        if (noteElement) {
          saveImagesToLocalStorage(noteId, noteElement);
        }
      }
      
      function newNote(title){
        var new_note = document.createElement("section");
        new_note.className = "note";

        var datetime = new Date();
        var datetime_string = datetime.toString();
        new_note.title = "Created: "+datetime_string+"\nModified: "+datetime_string;

        var settings = JSON.parse(document.getElementById("info-saver").textContent);
        settings["id-counter"] += 1
        document.getElementById("info-saver").textContent = JSON.stringify(settings);
        new_note.id = "note"+settings["id-counter"];

        var note_id = document.createElement("div");
        note_id.className = "note-id";
        note_id.textContent = settings["id-counter"];
        note_id.title = "Note ID";
        new_note.appendChild(note_id);
        
        var note_title = document.createElement("h1");
        note_title.className = "title";
        note_title.textContent = title;
        new_note.appendChild(note_title);

        var note_content = document.createElement("div");
        note_content.className = "content";
        note_content.textContent = "New Note Content";
        new_note.appendChild(note_content);

        var note_labels = document.createElement("div");
        note_labels.className = "note-labels";
        new_note.appendChild(note_labels);

        var note_footer = document.createElement("div");
        note_footer.className = "note-footer";
        var edit_button = document.createElement("button");
        edit_button.className = "action-button";
        edit_button.textContent = "Start Editing Note";
        edit_button.setAttribute("onclick", "editNote(this);");
        note_footer.appendChild(edit_button);
        var delete_button = document.createElement("button");
        delete_button.className = "action-button delete";
        delete_button.textContent = "Delete";
        delete_button.setAttribute("onclick", "deleteNote(this);");
        note_footer.appendChild(delete_button);
        new_note.appendChild(note_footer);

        loadImagesFromLocalStorage(new_note.id, new_note);

        document.getElementById("notes-list").prepend(new_note);

        saveNoteImages(new_note.id);

        saveNotesToLocalStorage();
      }
      function deleteNote(elem){
        var ask_confirm = prompt("Confirm Note Deleting with \"yes\"");
        if (ask_confirm == "yes"){
          elem.parentElement.parentElement.remove();
          checkLabels();
        }
        saveNotesToLocalStorage();
      }
      if (!document.getElementById("notif-list")){
        var notif_list = document.createElement("div");
        notif_list.id = "notif-list";
        notif_list.className = "notif-list";
        document.body.appendChild(notif_list);
      }else{
        var notif_list = document.getElementById("notif-list");
      };

      
      window.addEventListener('beforeunload', function (event) {
        event.preventDefault();
        event.returnValue = '';
      });

      function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }


   