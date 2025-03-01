/*! For license information please see investment-loan-list.js.LICENSE.txt */
"use strict";document.addEventListener("DOMContentLoaded",(function(){if($("#areachartblue1").length>0){window.randomScalingFactor=function(){return Math.round(20*Math.random())};var t=document.getElementById("areachartblue1").getContext("2d"),e=t.createLinearGradient(0,0,0,300);e.addColorStop(0,"rgba(0, 73, 232, 0.5)"),e.addColorStop(1,"rgba(0, 73, 232, 0)");var a=t.createLinearGradient(0,0,0,280);a.addColorStop(0,"rgba(200, 0, 54, 0.5)"),a.addColorStop(1,"rgba(200, 0, 54, 0)");var r=t.createLinearGradient(0,0,0,280);r.addColorStop(0,"rgba(0, 186, 133, 0.85)"),r.addColorStop(1,"rgba(0, 186, 133, 0)");new Chart(t,{type:"line",data:{labels:["1","2","3","4","5","7","8","9","10","11","12"],datasets:[{label:"EMI",data:[700,1400,2100,2800,3500,4200,4900],radius:2,backgroundColor:r,borderColor:"#00a885",borderWidth:1,borderRadius:4,fill:!0,tension:.5},{label:"Principal",data:[1e4,9500,9e3,8500,8e3,7500,7e3,6500,6e3,5500,5e3,40],radius:0,backgroundColor:"rgba(0,0,0,0)",borderColor:"#015EC2",borderWidth:1,borderRadius:4,fill:!0,tension:.5},{label:"Interest",data:[14e3,13400,12800,12200,11600,11e3,10400,9800,9200,8600,8e3],radius:0,backgroundColor:"rgba(0,0,0,0)",borderColor:"#fc7a1e",borderWidth:1,borderRadius:4,fill:!0,tension:.5}]},options:{maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{enabled:!0}},scales:{y:{display:!0,beginAtZero:!0},x:{display:!0}}}})}$("#circleprogressgreen1").length>0&&new ProgressBar.Circle(circleprogressgreen1,{color:"#91C300",strokeWidth:10,trailWidth:10,easing:"easeInOut",trailColor:"#eaf4d8",duration:1400,text:{autoStyleContainer:!1},from:{color:"#91C300",width:10},to:{color:"#91C300",width:10},step:function(t,e){e.path.setAttribute("stroke",t.color),e.path.setAttribute("stroke-width",t.width);var a=Math.round(100*e.value());0===a?e.setText(""):e.setText(a+"<small>%<small>")}}).animate(.08);if($("#smartwizard").length>0&&($("#smartwizard").smartWizard({theme:"dots",toolbar:{extraHtml:'<a class="btn btn-theme finish-btn" style="display:none" href="investment-loan-request-success.html">Finish</a>'}}),$("#smartwizard").on("showStep",(function(t,e,a,r,o){"last"===o?$(".finish-btn").show():$(".finish-btn").hide()}))),$("#doughnutchart").length>0){var o=document.getElementById("doughnutchart").getContext("2d");new Chart(o,{type:"doughnut",data:{labels:["Principle","Interest"],datasets:[{label:"Principle and Interest",data:[55,45],backgroundColor:["#0049e8","#cad8f8"],borderWidth:0}]},options:{responsive:!0,cutout:70,tooltips:{position:"nearest",yAlign:"bottom"},plugins:{legend:{display:!1,position:"top"},title:{display:!1,text:"Chart.js Doughnut Chart"}},layout:{padding:0}}})}}));