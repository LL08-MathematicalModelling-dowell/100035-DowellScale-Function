
def generate_pairs(item_count, item_list):
    paired_items = []
    i = 0
    while 0 <= i < item_count:
        j = i + 1
        while i < j < item_count:
            paired_items.append([item_list[i], item_list[j]])
            j += 1
        i += 1
    return paired_items
    
def arrange_ranking(paired_items, products_ranking):
    result = []
    if len(paired_items) != len(products_ranking):
        return False
    for n in range(len(paired_items)):
        if products_ranking[n] != paired_items[n][0]:
            result.append([paired_items[n][1], paired_items[n][0]])
        else:
            result.append(paired_items[n])
    return result

def segment_ranking(arranged_ranking):
    arranged_ranking.reverse()
    result = []
    i, j = 0, 1
    cycle = 2
    while j <= len(arranged_ranking):
        result.append(arranged_ranking[i:j])
        i = j
        j += cycle
        cycle += 1
    result.reverse()
    return result

def create_map(array, product):
    left = []
    right = []
    for item in array:
        if product == item[0]:
            right.append(item[1])
        else:
            left.append(item[0])
    mmap = []
    for item in left:
        mmap.append(item)
    mmap.append(product)
    for item in right:
        mmap.append(item)
    return mmap, left, right

def get_relationship(mmap, item):
    expected = []
    left = mmap[1]
    right = mmap[2]
    if (item[0] in left) and (item[1] in left):
        return False
    if (item[0] in right) and (item[1] in right):
        return False
    for product in mmap[0]:
        if product in item:
            expected.append(product)
    return expected
    
def find_inconsistent_pair(result_list, item_list):
    for i in range(len(result_list)):
        mmap = create_map(result_list[i], item_list[i])
        j = i + 1
        while j <= len(result_list)-1:
            i = 0
            while i <= len(result_list[j])-1:
                item = result_list[j][i]
                expected = get_relationship(mmap, item)
                if expected == False:
                    pass
                else:
                    if expected != item:
                        return(False, j, i)
                i += 1
            j += 1
    return True

        
        
        
        
        
        
        
    
        
        
    
    
    
    
    
    
    
    


            

        



