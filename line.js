//设置误差
let e=0.001;
//按顺序储存交点
let sequence=[];
//储存分割后线段
let splitArray=[],len=0;
//储存交点个数及坐标
let Intersection=[],X=0;
//储存连接后的线段
let Ultimatum=[],Ul_len=0;
//去重后最终结果
let result=[],result_len=0;
//求最小值
function min(a,b) {
    if(a>b)
        return b;
    else
        return a;
}
//求最大值
function max(a,b) {
    if(a>b)
        return a;
    else
        return b;
}
//求绝对值
function absolute(x){
    if(x>=0)
        return x;
    else if(x<0)
        return -x;
}
//判断两点重合
function equal(point1,point2) {
    if (absolute(point1[0] - point2[0]) <= e && absolute(point1[1] - point2[1]) <= e)
        return 1;
    else
        return 0;
}
//两点间线段长度
function line_len([a1,a2],[b1,b2]){
    return Math.sqrt(Math.pow(b2-a2,2)+Math.pow(b1-a1,2));
}
//计算两条线段的交点
function calculate([a1,a2],[b1,b2],[c1,c2],[d1,d2]) {
    let denominator = (b2 - a2) * (d1 - c1) - (b1 - a1) * (d2 - c2);
    let k1 = (b2 - a2) / (b1 - a1);
    let k2 = (d2 - c2) / (d1 - c1);
    if (denominator === 0)
        return 0;
    else {
        let x = ((c2 - a2) * (b1 - a1) * (d1 - c1) + (b2 - a2) * (d1 - c1) * a1 - (d2 - c2) * (b1 - a1) * c1) / denominator;
        let y;
        if (k1 === 0 && k2 !== 0) {
            y = a2;
        } else if (k1 !== 0 && k2 === 0) {
            y = c2;
        } else {
            y = k2 * x + c2 - (d2 - c2) * c1 / (d1 - c1);
        }
        if(x===undefined||y===undefined)
            return 0;
        if (min(a1, b1) <= x && x <= max(a1, b1)) {
            if (min(a2, b2) <= y && y <= max(a2, b2)) {
                if (min(c1, d1) <= x && x <= max(c1, d1)) {
                    if (min(c2, d2) <= y && y <= max(c2, d2))
                        return [x, y];
                }
            }
        } else
            return 0;
    }
    return 0;
}
//计算直线中点的个数
function count(line) {
    let m=1
    for(let n=0;n<m;n++)
    {
        if(line[n]===undefined) {
            return n;
        }else
            m++;
    }
}
//计算两条折线交点
function calculateLine(line1,line2) {
    let quantity1=count(line1);
    let quantity2=count(line2);
    for (let n = 0; n < quantity1 - 1; n++) {
        for (let m = 0; m < quantity2 - 1; m++) {
            let result = calculate(line1[n], line1[n + 1], line2[m], line2[m + 1]);
            if (result !== 0) {
                Intersection[X] = result;
                X++;
            }
        }
    }
    if (line1[quantity1 - 1][0] === line2[quantity2 - 1][0] && line1[quantity1 - 1][1] === line2[quantity2 - 1][1]) {
        Intersection[X] = line1[quantity1 - 1];
        X++;
    }
}
//删除重复交点
function RemoveIntersection(points) {
    for (let n = 0; n < X; n++) {
        for (let m = 0; m < X; m++) {
            let v1 = points[n][0] - points[m][0];
            let v2 = points[n][1] - points[m][1];
            if (n === m) {
                continue;
            }
            if (-e <= v1 && v1 <= e) {
                if (-e <= v2 && v2 <= e) {
                    points.splice(m, 1);
                    X--;
                    m--;
                }
            }
        }
    }
}
//检查是否有交点
function detect([a1,a2],[b1,b2]) {
    let online = [], online_len = 0;
    if (absolute(a1 - b1) <= e) {
        for(let n=0;n<X;n++){
            if(absolute(Intersection[n][0]-a1)<=e){
                if(Intersection[n][1]-min(a2,b2)>e&&max(a2,b2)-Intersection[n][1]>e){
                    online[online_len]=Intersection[n];
                    online_len++;
                }
            }
        }
    } else {
        let k = (b2 - a2) / (b1 - a1);
        for (let n = 0; n < X; n++) {
            let x = Intersection[n][0];
            if (x - min(a1, b1) > e && max(a1, b1) - x > e) {
                let y = k * x + b2 - k * b1;
                if (absolute(y - Intersection[n][1]) <= e) {
                    online[online_len] = Intersection[n];
                    online_len++;
                }
            }
        }
    }
    return online;
}
//根据交点将折线分割
function split(line) {
    for (let n = 0; n < count(line); n++) {
        if (line[n + 1] === undefined)
            break;
        let online = detect(line[n], line[n + 1]);
        let online_len = count(online);
        if (online_len === 0) {
            splitArray[len] = [];
            splitArray[len][0] = line[n];
            splitArray[len][1] = line[n + 1];
            len++;
        } else if (online_len === 1) {
            splitArray[len] = [];
            splitArray[len + 1] = [];
            splitArray[len][0] = line[n];
            splitArray[len][1] = online[0];
            splitArray[len + 1][0] = online[0];
            splitArray[len + 1][1] = line[n + 1];
            len = len + 2;
        } else if (online_len > 1) {
            for (let locate = 0; locate < online_len; locate++) {
                let min_distance = online[locate][0] - line[n][0];
                for (let m = 0; m < online_len; m++) {
                    let distance = online[m][0] - line[n][0];
                    if (distance < min_distance) {
                        min_distance = distance;
                        let u = online[locate];
                        online[locate] = online[m];
                        online[m] = u;
                    }
                }
            }
            splitArray[len] = [];
            splitArray[len][0] = line[n];
            splitArray[len][1] = online[0];
            len++;
            for (let n = 0; n < online_len; n++) {
                if(online[n + 1]===undefined)
                    break;
                splitArray[len] = [];
                splitArray[len][0] = online[n];
                splitArray[len][1] = online[n + 1];
                len++;
            }
            splitArray[len] = [];
            splitArray[len][0] = online[online_len-1];
            splitArray[len][1] = line[n+1];
            len++;
        }
    }
}
//删除重复线段
function RemoveRepetition(lines) {
    for(let n=0;n<len;n++)
    {
        for(let m=0;m<len;m++)
        {
            if(n===m)
                continue;
            if(JSON.stringify(lines[n][0])===JSON.stringify(lines[m][0])&&JSON.stringify(lines[n][1])===JSON.stringify(lines[m][1])) {
                lines.splice(m, 1);
                len--;
            }
            else if(JSON.stringify(lines[n][0])===JSON.stringify(lines[m][1])&&JSON.stringify(lines[n][1])===JSON.stringify(lines[m][0])) {
                lines.splice(m,1);
                len--;
            }
        }
    }
}
//删除悬挂线
function RemoveHanging(lines) {
    for (let l = 0; l < len; l++) {
        let D = 0;
        for (let n = 0; n < len; n++) {
            let E1 = 0, E2 = 0;
            for (let m = 0; m < len; m++) {
                if (n === m)
                    continue;
                let a1 = lines[n][0][0], a2 = lines[n][0][1];
                let b1 = lines[n][1][0], b2 = lines[n][1][1];
                let A1 = lines[m][0][0], A2 = lines[m][0][1];
                let B1 = lines[m][1][0], B2 = lines[m][1][1];
                if (absolute(a1 - A1) <= e && absolute(a2 - A2) <= e)
                    E1 = 1;
                else if (absolute(a1 - B1) <= e && absolute(a2 - B2) <= e)
                    E1 = 1;
                if (absolute(b1 - A1) <= e && absolute(b2 - A2) <= e)
                    E2 = 1;
                else if (absolute(b1 - B1) <= e && absolute(b2 - B2) <= e)
                    E2 = 1;
            }
            if (E1 === 0 || E2 === 0) {
                lines.splice(n, 1);
                len--;
                n--;
                D = 1;
            }
        }
        if (D === 0)
            break;
    }
}
//判断是否相连，若相连，返回下一个点
function judge(point1,point2,point3,point4){
    if(equal(point2,point3)===1){
        if(equal(point1,point4)===1)
            return 0;
        else
            return point4;
    }
    else if(equal(point2,point4)===1){
        if(equal(point1,point3)===1)
            return 0;
        else
            return point3;
    }
    else
        return 0;
}
//求两条线段的夹角余弦
function angle([a1,a2],[b1,b2],[c1,c2],[d1,d2]) {
    let cos;
    let vector1y = b2 - a2, vector1x = b1 - a1;
    let vector2y = d2 - c2, vector2x = d1 - c1;
    let l1 = Math.sqrt(vector1y * vector1y + vector1x * vector1x);
    let l2 = Math.sqrt(vector2y * vector2y + vector2x * vector2x);
    cos = vector1x * vector2x + vector1y * vector2y / l1 * l2;
    return cos;
}
//求直线方向 1-左 2-右 3-直
function direction([a1,a2],[b1,b2],[c1,c2],[d1,d2]){
    if(absolute(b1-a1)<= e){
        if(b2-a2<-e){
            if(d1-b1>e)
                return 1;
            else if(d1-b1<-e)
                return 2;
            else if(absolute(d1-b1)<= e)
                return 3;
        }else if(b2-a2>e){
            if(d1-b1>e)
                return 2;
            else if(d1-b1<-e)
                return 1;
            else if(absolute(d1-b1)<=e)
                return 3;
        }
    }else if(b1-a1>e){
        let k=(b2-a2)/(b1-a1);
        let y=k*d1+b2-k*b1;
        if(d2-y>e)
            return 1;
        else if(d2-y<-e)
            return 2;
        else if(absolute(d2-y)<=e)
            return 3;
    }else if(b1-a1<-e){
        let k=(b2-a2)/(b1-a1);
        let y=k*d1+b2-k*b1;
        if(d2-y>e)
            return 2;
        else if(d2-y<-e)
            return 1;
        else if(absolute(d2-y)<=e)
            return 3;
    }
}
//连接
function connect(lines){
    for(let n=0;n<len;n++) {
        let midArray = [];
        midArray[0] = [];
        midArray[1] = [];
        let mid1_len = 2, mid2_len = 2;
        midArray[0][0] = lines[n][0];
        midArray[0][1] = lines[n][1];
        midArray[1][0] = lines[n][0];
        midArray[1][1] = lines[n][1];
        //左侧
        for (let k = 0; k < len; k++) {
            let left = [], left_len = 0;
            let right = [], right_len = 0;
            let straight = [], straight_len = 0;
            for (let m = 0; m < len; m++) {
                let jud = judge(midArray[0][mid1_len - 2], midArray[0][mid1_len - 1], lines[m][0], lines[m][1]);
                if (jud !== 0) {
                    let cos = angle(midArray[0][mid1_len - 2], midArray[0][mid1_len - 1], midArray[0][mid1_len - 1], jud);
                    let dir = direction(midArray[0][mid1_len - 2], midArray[0][mid1_len - 1], midArray[0][mid1_len - 1], jud);
                    if (dir === 1) {
                        left[left_len] = [jud[0], jud[1], cos];
                        left_len++;
                    } else if (dir === 2) {
                        right[right_len] = [jud[0], jud[1], cos];
                        right_len++;
                    } else if (dir === 3) {
                        straight[straight_len] = [jud[0], jud[1], cos];
                        straight_len++;
                    }
                }
            }
            if (left_len + straight_len + right_len === 0)
                break;
            if (left_len !== 0) {
                let minCos = left[0][3], minPosition = 0;
                for (let l = 0; l < left_len; l++) {
                    if (left[l][3] < minCos) {
                        minCos = left[l][3];
                        minPosition = l;
                    }
                }
                midArray[0][mid1_len] = [];
                midArray[0][mid1_len][0] = left[minPosition][0];
                midArray[0][mid1_len][1] = left[minPosition][1];
                mid1_len++;
            } else if (straight_len !== 0) {
                let maxCos = straight[0][3], maxPosition = 0;
                for (let l = 0; l < straight_len; l++) {
                    if (straight[l][3] > maxCos) {
                        maxCos = straight[l][3];
                        maxPosition = l;
                    }
                }
                midArray[0][mid1_len] = [];
                midArray[0][mid1_len][0] = straight[maxPosition][0];
                midArray[0][mid1_len][1] = straight[maxPosition][1];
                mid1_len++;
            } else if (right_len !== 0) {
                let maxCos = right[0][3], maxPosition = 0;
                for (let l = 0; l < right_len; l++) {
                    if (right[l][3] > maxCos) {
                        maxCos = right[l][3];
                        maxPosition = l;
                    }
                }
                midArray[0][mid1_len] = [];
                midArray[0][mid1_len][0] = right[maxPosition][0];
                midArray[0][mid1_len][1] = right[maxPosition][1];
                mid1_len++;
            }
            if (absolute(midArray[0][mid1_len - 1][0] - midArray[0][0][0]) <= e && absolute(midArray[0][mid1_len - 1][1] - midArray[0][0][1]) <= e) {
                Ultimatum[Ul_len] = midArray[0];
                Ul_len++;
                break;
            }
        }
        //右侧
        for (let k = 0; k < len; k++) {
            let left = [], left_len = 0;
            let right = [], right_len = 0;
            let straight = [], straight_len = 0;
            for (let m = 0; m < len; m++) {
                let jud = judge(midArray[1][mid2_len - 2], midArray[1][mid2_len - 1], lines[m][0], lines[m][1]);
                if (jud !== 0) {
                    let cos = angle(midArray[1][mid2_len - 2], midArray[1][mid2_len - 1], midArray[1][mid2_len - 1], jud);
                    let dir = direction(midArray[1][mid2_len - 2], midArray[1][mid2_len - 1], midArray[1][mid2_len - 1], jud);
                    if (dir === 1) {
                        left[left_len] = [jud[0], jud[1], cos];
                        left_len++;
                    } else if (dir === 2) {
                        right[right_len] = [jud[0], jud[1], cos];
                        right_len++;
                    } else if (dir === 3) {
                        straight[straight_len] = [jud[0], jud[1], cos];
                        straight_len++;
                    }
                }
            }
            if (left_len + straight_len + right_len === 0)
                break;
            if (right_len !== 0) {
                let minCos = right[0][3], minPosition = 0;
                for (let l = 0; l < right_len; l++) {
                    if (right[l][3] < minCos) {
                        minCos = right[l][3];
                        minPosition = l;
                    }
                }
                midArray[1][mid2_len] = [];
                midArray[1][mid2_len][0] = right[minPosition][0];
                midArray[1][mid2_len][1] = right[minPosition][1];
                mid2_len++;
            } else if (straight_len !== 0) {
                let maxCos = straight[0][3], maxPosition = 0;
                for (let l = 0; l < straight_len; l++) {
                    if (straight[l][3] > maxCos) {
                        maxCos = straight[l][3];
                        maxPosition = l;
                    }
                }
                midArray[1][mid2_len] = [];
                midArray[1][mid2_len][0] = straight[maxPosition][0];
                midArray[1][mid2_len][1] = straight[maxPosition][1];
                mid2_len++;
            } else if (left_len !== 0) {
                let maxCos = left[0][3], maxPosition = 0;
                for (let l = 0; l < left_len; l++) {
                    if (left[l][3] > maxCos) {
                        maxCos = left[l][3];
                        maxPosition = l;
                    }
                }
                midArray[1][mid2_len] = [];
                midArray[1][mid2_len][0] = left[maxPosition][0];
                midArray[1][mid2_len][1] = left[maxPosition][1];
                mid2_len++;
            }
            if (absolute(midArray[1][mid2_len - 1][0] - midArray[1][0][0]) <= e && absolute(midArray[1][mid2_len - 1][1] - midArray[1][0][1]) <= e) {
                Ultimatum[Ul_len] = midArray[1];
                Ul_len++;
                break;
            }
        }
    }
}
//去除重复封闭图形
function Remove(lines) {
    result[result_len] = lines[0];
    for (let n = 0; n < Ul_len; n++) {
        let number1 = count(lines[n]);
        let same = 0;
        for (let m = 0; m < result_len; m++) {
            let number2 = count(result[m]);
            let repeat = 0;
            for (let l = 0; l < number1 - 1; l++) {
                for (let k = 0; k < number2 - 1; k++) {
                    if (absolute(lines[n][l][0] - result[m][k][0]) <= e && absolute(lines[n][l][1] - result[m][k][1]) <= e) {
                        repeat++;
                        break;
                    }
                }
            }
            if (repeat === number1 - 1) {
                same++;
                break;
            }
        }
        if (same === 0) {
            result[result_len] = lines[n];
            result_len++;
        }
    }
}
//集成
function main(lines) {
    let numOfLines=count(lines);
    for(let a=0;a<numOfLines;a++) {
        for(let b=0;b<numOfLines;b++) {
            if(a===b)
                continue;
            calculateLine(lines[a], lines[b]);
        }
    }
    RemoveIntersection(Intersection);
    console.log(Intersection);
    for(let a=0;a<numOfLines;a++) {
        split(lines[a]);
    }
    RemoveRepetition(splitArray);
    RemoveHanging(splitArray);
    console.log(splitArray);
    connect(splitArray);
    Remove(Ultimatum);
    console.log(result);
}


let P=50;
let lineA=[],lineB=[],lineC=[],lineE=[],k1=0,k2=0,lineD=[],lineF=[],kk=Math.round(Math.random()*10),k3=0
for(let l=0;l<P;l++)
{
        k1=Math.round(Math.random()*10);
        k2=Math.round(Math.random()*10);
        k3=Math.round(Math.random()*10);
        lineA.push([l*10,100+k1]);
        lineB.push([l*10,60+k2]);
        lineC.push([288+k1+kk*20,l*3]);
        lineD.push([288+k3,l*3]);
        lineE.push([288+k2-kk*20,l*3]);
        lineF.push([l*10,20+k3]);
}

let inputs=[lineA,lineB,lineC,lineD,lineE,lineF];
main(inputs);

let line1=result[0];
let line2=result[1];
let line3=result[2];
let line4=result[3];
let line5=result[4];
let line6=result[5];
let line7=result[6];
let line8=result[7];
let line9=result[8];
let line10=result[9];
