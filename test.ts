Aicococam.initMode(protocolAlgorithm.ALGORITHM_OBJECT_TRACKING)
basic.forever(function () {
    Aicococam.request()
    if (Aicococam.isAppear_s(COCOCAMResultType_t.COCOCAMResultBlock)) {
        if (Aicococam.isLearned(1)) {
            serial.writeValue("x", Aicococam.readeBox(1, Content1.xCenter))
            serial.writeValue("y", Aicococam.readeBox(1, Content1.yCenter))
            serial.writeValue("k", Aicococam.readeBox(1, Content1.width))
            serial.writeValue("h", Aicococam.readeBox(1, Content1.height))
        } else {
            serial.writeString("-1")
        }
    } else {
        serial.writeString("-1")
    }
})
