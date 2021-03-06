/**
 * @namespace representors
 * @author Mike Amundsen (@mamund)
 * @created 2020-02-01
 * @description
 * CSV response template
 */
 
exports.template = 
{
  format: "text/csv",
  view: 
  `<%var y=0;%><%for(var p in rtn[0]){%><%if(y!==0){%>,<%}%>"<%=p%>"<%y=1;%><%}%>
<%rtn.forEach(function(item){%><%var y=0;%><%for(var p in item){%><%if(y!==0){%>,<%}%>"<%=item[p]%>"<%y=1;%><%}%>
<%});%>`
}

// EOF
