aicococam.initMode(protocolAlgorithm.ALGORITHM_OBJECT_TRACKING)
basic.forever(function () {
    aicococam.request()
    if (aicococam.isAppear_s(COCOCAMResultType_t.COCOCAMResultBlock)) {
        if (aicococam.isLearned(1)) {
            serial.writeValue("x", aicococam.readeBox(1, Content1.xCenter))
            serial.writeValue("y", aicococam.readeBox(1, Content1.yCenter))
            serial.writeValue("k", aicococam.readeBox(1, Content1.width))
            serial.writeValue("h", aicococam.readeBox(1, Content1.height))
        } else {
            serial.writeString("-1")
        }
    } else {
        serial.writeString("-1")
    }
})
