Dim appRef
Set appRef = CreateObject( "Photoshop.Application" )

Dim argsArr()
ReDim argsArr(Wscript.Arguments.length-1)
For i = 0 To Wscript.Arguments.length-1
    argsArr(i) = Wscript.Arguments(i)
Next

appRef.DoJavaScriptFile Wscript.Arguments(0), argsArr, 1
