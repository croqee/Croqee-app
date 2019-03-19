def calculateScore(results):

    worstResult = 249
    if results < 100:
            score = (((250-results)/250)*100) 
    elif  results < worstResult:
            score = ((250-results)/250)*100  
    else:   
            score = 0 
    print(score)
    return score