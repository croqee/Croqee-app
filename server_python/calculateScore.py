def calculateScore(results):
    worstResult = 1000
    if results < 100:
            score = (((worstResult-results)/worstResult)*100) 
    elif  results < worstResult:
            print((worstResult-results)/worstResult)
            score = ((worstResult-results)/worstResult)*100  
            print(score)
    else:   
            score = 0 
    print(score)
    return score