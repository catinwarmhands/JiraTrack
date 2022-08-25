import React from 'react';
import {Switch, Layout} from "antd";
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import 'material-icons/iconfont/material-icons.css';

import 'antd/dist/antd.css';
import "./styles/Fonts.css"
import "./styles/Scrollbar.css"
import "./styles/App.css"

interface AppProps {
}

interface AppState {
    theme: string;
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            theme: localStorage.getItem("theme") || "light"
        };
        this.handleColorChange(this.state.theme === "dark")
    }

    handleColorChange = (isDarkTheme: boolean) => {
        const theme = isDarkTheme ? "dark" : "light";
        this.setState({theme});

    }

    componentDidUpdate = (prevProps: Readonly<AppProps>, prevState: Readonly<AppState>) => {
        if (this.state.theme !== prevState.theme) {
            const container = document.getElementsByTagName("body")[0];
            localStorage.setItem("theme", this.state.theme);
            container.setAttribute("data-theme", this.state.theme);
        }
    }

    renderHeader = () => {
        return (
            <div className={"header"}>
                <div className={"logo"}>JiraTrack</div>
                <Switch className={"theme-switch"}
                    checkedChildren={<span className="material-icons-outlined">dark_mode</span>}
                    unCheckedChildren={<span className="material-icons-outlined">light_mode</span>}
                    defaultChecked={this.state.theme === "dark"}
                    onChange={this.handleColorChange}
                />
            </div>
        );
    }

    renderFooter = () => {
        const year = new Date().getFullYear();
        return (
            <div className={"footer"}>
                <p><a href="https://github.com/catinwarmhands/JiraTrack">JiraTrack</a></p>
                <p>Created by <a href="https://github.com/catinwarmhands">Lev Buimistriuk</a> at <a href="https://www.neoflex.ru/">Neoflex</a> {"©" + year}</p>
            </div>
        );
    }

    renderContent = (a: boolean) => {
        if (!a) {
            return (
                <div className={"main"}>
                    <span className="material-icons-outlined">light_mode</span>
                    <span className="material-icons-outlined">dark_mode</span>
                </div>
            );
        }
        return (
          <div className={"main"}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vel ultricies nibh, vel efficitur eros. Morbi dictum libero est, ac malesuada tortor ornare non. Aliquam sed consectetur leo, a vehicula diam. Cras fringilla, sem eu finibus interdum, quam tortor cursus ipsum, quis ornare mauris sem at lorem. Phasellus quis semper lorem. Aenean sed ultrices enim. Curabitur diam urna, fringilla id iaculis id, convallis eget nibh.

              Mauris at diam volutpat, imperdiet sem non, pretium risus. Sed at hendrerit eros. Curabitur eget justo faucibus, lacinia turpis quis, convallis augue. Morbi accumsan aliquam risus a pulvinar. Aenean tempus luctus iaculis. Donec et congue lorem, vel placerat orci. Aenean ultrices faucibus lacus non dictum. Duis rhoncus dui eu justo commodo cursus. Vestibulum a consequat purus. Ut eget gravida neque, ut gravida velit. Duis quis mattis justo. Aenean eu blandit velit. Suspendisse potenti. Praesent in dignissim lacus. Maecenas mattis magna a elementum commodo.

              Sed nec tincidunt nibh, sit amet commodo nisl. Curabitur pulvinar nulla eu ligula eleifend laoreet. Nam vel imperdiet neque. Donec tristique mi ut ante facilisis lacinia. Morbi pretium urna non diam mattis, non gravida ipsum ornare. Praesent at pharetra sapien. Sed semper ex non placerat tempor. Integer tortor neque, facilisis non ornare quis, rhoncus quis orci. Vestibulum accumsan aliquam nisi a mollis. Morbi ut arcu a mi consectetur ullamcorper. Nam aliquet augue dolor. Etiam convallis mi velit. Ut a ultricies nulla. Nam in nibh fringilla, aliquam ante sed, varius quam. Vestibulum et magna lacus. Mauris quis nisi at ipsum viverra vehicula.

              Vestibulum interdum elit in orci placerat bibendum. Duis mi nulla, venenatis sit amet blandit et, accumsan a sapien. Pellentesque eget ligula non mauris hendrerit semper porttitor eget augue. Cras cursus orci urna, nec tincidunt nulla suscipit in. Ut eget finibus elit. Cras sit amet leo placerat, vehicula risus euismod, lobortis risus. Nulla eu ultricies sapien. Aliquam mattis cursus orci, nec fringilla enim blandit et. Nam congue, odio in vehicula feugiat, sapien eros elementum ante, a pellentesque erat nisl id enim. Quisque eu tincidunt lorem, ac iaculis justo. Nulla consectetur sit amet nibh id molestie. Maecenas et aliquet erat, et efficitur nisl. Sed ut sem in mi tincidunt ultrices. Nam feugiat iaculis posuere. Vivamus dapibus lorem eget ex bibendum viverra.

              Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam sed purus lacus. Nulla vitae dui euismod, imperdiet magna quis, vestibulum ipsum. Maecenas lobortis sollicitudin sagittis. Phasellus id magna eleifend, euismod risus nec, auctor dolor. Donec dignissim placerat sem, et ultricies nunc imperdiet quis. Vestibulum feugiat lacinia lectus, non tempus tortor. Fusce quis fermentum tortor. Curabitur ultricies nunc ac nibh lobortis condimentum. Maecenas ut lectus nec magna placerat fringilla vel eu nunc. Praesent euismod odio blandit, ullamcorper nisl quis, dictum nunc. Aliquam volutpat congue diam, sit amet laoreet risus ullamcorper sit amet. Curabitur facilisis bibendum erat, rhoncus eleifend ligula faucibus sit amet. Vestibulum gravida sit amet lectus et elementum.

              Aliquam eget sollicitudin tortor. Aliquam quis mollis urna. Etiam arcu ex, imperdiet non quam at, tempor ultricies est. Ut in tellus finibus, cursus augue id, porta arcu. Pellentesque fringilla ultricies ornare. Sed molestie, neque sit amet molestie elementum, mi felis hendrerit dui, non tristique magna urna eget eros. Proin fermentum varius dui, in vulputate eros viverra ut. Praesent pharetra lectus et diam auctor porta. Cras convallis turpis justo. Sed feugiat ante quam, non aliquam metus mattis vitae.

              Pellentesque eget rutrum eros. Sed a metus tincidunt, vulputate lorem vel, tincidunt orci. Proin gravida euismod ligula in euismod. Maecenas dignissim turpis at fermentum sagittis. Curabitur varius id libero non molestie. Proin dapibus faucibus metus eget sagittis. In euismod, turpis sit amet vehicula vehicula, eros turpis volutpat metus, venenatis hendrerit enim arcu at nisl. Sed consequat neque non lorem molestie condimentum. Sed volutpat justo a eros blandit maximus. Suspendisse consectetur ligula vitae ipsum mattis finibus. Donec porta elementum risus quis aliquet.

              Morbi ac nulla venenatis, malesuada lacus sit amet, hendrerit diam. Fusce vel dui eleifend, hendrerit risus vel, tempus enim. Praesent fringilla ex vitae ornare finibus. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed ullamcorper vel leo vitae ultricies. Nunc nec commodo libero. Morbi sed rhoncus felis. Pellentesque tincidunt, quam at convallis mollis, mi ex tristique nibh, non lacinia dui felis a metus. Duis sit amet consequat dui. Etiam mattis dapibus felis, vitae lacinia lacus auctor interdum. Morbi quis euismod erat. Pellentesque sed placerat metus. Donec laoreet orci non nisl gravida mollis.

              Integer non ante urna. Duis turpis eros, euismod sit amet rutrum cursus, gravida at urna. Nunc semper dolor nec turpis aliquam, ac consequat leo pellentesque. Fusce enim elit, pretium et laoreet a, auctor ac leo. Curabitur semper mauris ut lorem porttitor, vitae feugiat purus blandit. Donec ac dolor sed nisi blandit sodales. Cras venenatis elementum libero quis facilisis. Proin neque lacus, fermentum convallis sapien vel, maximus vehicula nunc. Sed at justo vestibulum turpis bibendum varius. Suspendisse rhoncus ante at erat suscipit imperdiet. Cras quam augue, gravida at tristique pretium, cursus at felis. In scelerisque tristique vulputate. Sed non tempor leo. In a nisl in nisi maximus porta.

              Nullam dapibus consectetur augue a consequat. Ut nulla massa, cursus sed lorem nec, rhoncus tincidunt massa. Curabitur hendrerit mauris ut libero finibus malesuada. Duis tincidunt scelerisque libero, eget gravida turpis fringilla eget. Nunc ac nisi non velit mollis ornare. Aenean eget posuere dui, ac vehicula odio. Sed ultricies vel quam sed tempus. Ut quam velit, volutpat in nibh nec, ullamcorper efficitur sem. Quisque vel congue sem, tincidunt pellentesque massa. Nulla euismod nunc ut metus tempor feugiat. Suspendisse in leo sed velit consectetur placerat. Donec commodo cursus magna eget dictum. Vivamus at nunc condimentum, iaculis enim nec, tincidunt mauris. Duis a elit nibh.

              Fusce molestie purus ligula, id finibus urna vulputate sed. Proin porttitor efficitur nulla non eleifend. Fusce rutrum urna vitae urna lacinia, lacinia eleifend nulla vehicula. Nulla et eros ut nibh fringilla semper quis eu ligula. Mauris mattis at enim id pulvinar. Mauris eu erat accumsan, fermentum urna lacinia, egestas odio. Curabitur posuere nibh nec quam mollis luctus. Etiam ultricies lacinia libero, ac ultricies elit fringilla ac. Phasellus gravida ut odio et maximus. Sed maximus tortor nec consectetur dictum. Sed nec hendrerit sapien. Aenean varius tellus a purus tristique, ac varius nisi condimentum. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

              Suspendisse sodales, libero id rutrum convallis, turpis velit ultricies orci, ac rutrum arcu ex eu nunc. Quisque ullamcorper pellentesque leo et facilisis. Sed euismod magna at turpis tincidunt, a mollis ligula bibendum. Nulla ac semper quam. Fusce iaculis ligula at lectus varius, in commodo felis faucibus. Proin at odio nisi. Aliquam eget tortor cursus, accumsan est et, dapibus nisl. Cras sollicitudin consequat enim elementum convallis. Praesent at porta nunc, id blandit leo. Pellentesque interdum, ante at convallis lacinia, lorem lectus interdum ipsum, nec posuere nibh metus ac leo.

              Maecenas eu lorem aliquam, venenatis ex sed, egestas ante. Aenean a elit lorem. Sed nec lacus quam. Mauris placerat ante eget tempus finibus. Nullam eu vehicula arcu. Sed ac nibh eu diam bibendum rutrum. Sed nulla felis, molestie sit amet mauris ac, ornare vestibulum sem. Nam convallis varius massa, vitae tempus purus. Proin nec risus lectus. In risus odio, venenatis eu augue quis, volutpat feugiat lacus. Fusce neque libero, luctus vel ex non, suscipit tempor est. Etiam euismod id nulla vitae dapibus. Nunc consectetur arcu sit amet ante vestibulum, a viverra felis eleifend.

              Curabitur feugiat, ante id gravida tincidunt, eros mi molestie velit, ac vestibulum metus sapien a augue. Aenean vel eros ultrices, congue ipsum et, tempor eros. Donec eu efficitur nisl, quis vestibulum est. Ut eleifend tellus quis dapibus aliquet. Quisque eu odio eget enim posuere dignissim ut in quam. Curabitur tristique ligula vel massa aliquet, id finibus metus hendrerit. Fusce tincidunt ornare ligula, in pretium ligula porta sit amet. In at rhoncus purus. Aliquam in mi nisi. Nunc fermentum varius vestibulum. Suspendisse condimentum pretium ultrices. Nullam eleifend lobortis dapibus. Sed imperdiet a enim pharetra interdum. Maecenas et tempus metus.

              Vestibulum non felis hendrerit, volutpat nisl rutrum, fringilla felis. Donec semper metus sit amet semper cursus. In vitae consectetur felis. Suspendisse vitae nunc quis odio pulvinar venenatis. In elementum, libero ac commodo ornare, ex lacus aliquet justo, eu rutrum neque dolor sed risus. Aenean fermentum nisl in commodo lacinia. Ut porttitor ante et placerat sollicitudin. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus interdum aliquet augue id luctus. Nunc ac mi tellus.

              Donec imperdiet faucibus quam a rutrum. Morbi ac arcu in massa vestibulum tempor. Donec vel est magna. Praesent dui urna, malesuada quis felis in, laoreet blandit est. In hac habitasse platea dictumst. Donec vel facilisis mi, vel pulvinar tellus. Mauris elementum lacinia nibh ut malesuada. Nullam volutpat diam in massa volutpat, sed dictum erat ultricies. Nulla accumsan erat libero, vitae laoreet lacus imperdiet sed. Curabitur tellus lorem, tristique sit amet velit vel, sagittis condimentum enim. Curabitur sit amet nisl porta dui dapibus pharetra ac id magna. Phasellus malesuada enim vel lacus malesuada, nec viverra ligula dapibus. Etiam et congue dolor. Sed feugiat, justo quis elementum sollicitudin, mi mauris sagittis ante, eu rutrum odio felis sed mi. Nulla tincidunt turpis ut pellentesque blandit.

              Phasellus commodo varius ligula id iaculis. Mauris ultricies enim nec dolor egestas, cursus viverra risus ultricies. Suspendisse condimentum odio vitae sagittis maximus. Cras sed sollicitudin tellus. Aliquam ullamcorper magna odio, in vulputate urna consequat fermentum. Donec volutpat elit non risus auctor, in tincidunt dolor tempor. Vivamus viverra molestie velit et vestibulum. Donec at scelerisque quam. Ut rutrum non enim semper congue. Cras ac metus sed tellus pulvinar blandit. Nunc id metus vitae ligula pharetra efficitur. Nulla vitae posuere massa. Praesent varius erat et sem ultrices pulvinar ac quis ex. Sed a erat facilisis, ultricies elit sit amet, tempor purus. Etiam consectetur suscipit commodo.

              Nam dictum ipsum vel ipsum tristique, at ullamcorper nunc tincidunt. Suspendisse potenti. Nulla vulputate tincidunt lobortis. Ut quam lorem, accumsan non elit nec, rhoncus iaculis nisi. Ut accumsan est aliquam, commodo sem vel, iaculis turpis. In placerat sollicitudin tincidunt. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Ut ullamcorper malesuada purus in molestie. Nullam ullamcorper eros turpis. Morbi rutrum tincidunt mauris, sit amet congue mi rhoncus convallis. Fusce sodales non nunc nec pellentesque. Etiam in sodales justo. Proin commodo dui id urna laoreet, sed convallis ipsum placerat. Vestibulum at lorem maximus, egestas purus sed, commodo magna.

              Vestibulum sed neque finibus, gravida est sed, hendrerit diam. Sed dolor mi, lacinia sit amet maximus ut, bibendum ut sem. In finibus feugiat mauris vitae dignissim. Curabitur bibendum fringilla nisi sit amet egestas. Donec eget tempus nunc. Cras vehicula imperdiet hendrerit. Donec sit amet vestibulum orci, et cursus nulla. Nunc blandit mi odio, at facilisis ex tincidunt ut. Maecenas et scelerisque massa. Donec consequat aliquet felis, nec porttitor elit fermentum in. Donec convallis nisl eu justo lacinia laoreet. Duis facilisis non dui nec tempus. Nunc at diam tempor, porta felis nec, consectetur elit. Suspendisse imperdiet augue sit amet feugiat pellentesque. Morbi quis ornare mi. Donec pellentesque felis eu dolor pharetra, et congue ligula mattis.

              Aenean in maximus felis. Aliquam erat volutpat. Nam id velit nulla. Pellentesque venenatis mi felis. Proin mattis hendrerit lacus, ut iaculis enim tempor eget. Nullam hendrerit id mi a sagittis. Integer at dolor id turpis luctus auctor. Sed tempor posuere lacus, quis semper turpis aliquam non. In quam magna, aliquam nec lacus quis, suscipit placerat enim. Vestibulum ac ultrices dolor. Aliquam eleifend suscipit orci eu imperdiet. Praesent elementum accumsan arcu sit amet sagittis.

              Morbi dapibus justo a libero porta consectetur quis quis mauris. Nullam sit amet diam sed lectus efficitur rutrum efficitur non urna. Fusce a nulla vitae ligula mattis varius. Aenean maximus turpis sed elit rutrum gravida. Ut posuere dolor feugiat elit tristique, at elementum leo vehicula. Cras molestie, augue quis consequat tincidunt, quam enim ultrices lorem, et tempus mauris neque ut sem. Praesent sodales sapien non metus ornare iaculis. Pellentesque blandit cursus ullamcorper. Suspendisse potenti. Nulla facilisi. Sed egestas lacus nunc. Aenean orci nisl, ultricies in consequat ut, imperdiet nec lectus. Maecenas cursus urna id lacus dignissim elementum. Nulla diam tortor, sagittis non augue tristique, ornare ultricies metus. Nunc ultrices aliquet erat ut sagittis. Vestibulum dictum feugiat ligula eget interdum.

              Quisque fringilla tempus nulla id mattis. Etiam imperdiet nulla ut nisi elementum, sit amet lacinia libero eleifend. Integer laoreet libero a rhoncus semper. Nulla condimentum elit at interdum sollicitudin. Praesent mauris lacus, euismod in finibus fringilla, dignissim et nunc. In sodales mattis semper. Aliquam venenatis, tortor non pharetra gravida, ex nisi maximus velit, a venenatis lectus elit ac tortor. Proin iaculis nunc eu leo tristique pellentesque. Vivamus felis augue, hendrerit eu est eu, varius accumsan lorem.

              Vestibulum ornare tincidunt bibendum. Etiam bibendum purus risus, eu tempor mi varius ut. Aliquam sit amet urna suscipit, eleifend magna porttitor, commodo lacus. Nam a sagittis sem. Quisque orci tellus, scelerisque ac est sed, rutrum bibendum est. Sed et rhoncus purus, in vulputate lorem. Vestibulum sit amet erat ac sem mollis dignissim.

              Nullam interdum, risus sit amet condimentum auctor, nisi lectus dignissim dui, sit amet faucibus ante risus in sapien. Aliquam ullamcorper nec odio quis tincidunt. Sed dignissim tellus vitae dolor efficitur, eu efficitur libero luctus. Suspendisse vehicula semper risus, nec auctor est. Vivamus nec massa id diam iaculis posuere ac id urna. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam massa nisi, lobortis nec egestas vel, commodo ac ipsum. Aenean quam mauris, rhoncus ac pellentesque non, congue nec sapien.

              Proin vitae est ligula. Mauris et tellus lorem. Donec ex felis, malesuada sed neque maximus, posuere egestas lorem. Aliquam bibendum enim quis dui rhoncus faucibus. Vivamus posuere rhoncus tristique. Proin commodo accumsan metus ut commodo. Phasellus efficitur ipsum efficitur, volutpat massa sit amet, bibendum lorem. In ac pellentesque felis. Maecenas porta ipsum at egestas tincidunt. Pellentesque eget nunc magna. Donec a facilisis elit. In id rhoncus massa, id sagittis risus. Nullam maximus, velit et pulvinar egestas, metus dolor pharetra leo, ac blandit tortor enim eget felis. Suspendisse iaculis felis vitae aliquam suscipit. Aenean odio urna, tempus eget justo ac, blandit luctus lectus. Curabitur varius fermentum finibus.

              Maecenas ac hendrerit eros. Cras molestie non urna id tristique. Praesent laoreet a sem sed maximus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Duis eget elit vel ligula tristique fermentum id a enim. Quisque nec ipsum nec nisi commodo malesuada a eu magna. Etiam et mi iaculis, mollis tortor eget, dapibus leo. Duis sit amet mauris eu mi posuere vestibulum ut eget purus. Aenean sed sapien ac magna ullamcorper consectetur vel sit amet justo. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vivamus mattis a risus ut eleifend. Etiam pellentesque metus a libero convallis, maximus feugiat elit molestie. Maecenas sodales hendrerit sem, tincidunt sagittis neque iaculis in. Etiam gravida nec turpis sit amet volutpat. Nullam nec tincidunt turpis.

              Donec in mauris ex. Pellentesque maximus nulla diam, at ornare orci scelerisque vitae. Ut at finibus dolor. Curabitur ligula diam, fringilla sit amet convallis sit amet, suscipit at mi. Ut lectus velit, elementum sit amet posuere eu, cursus sit amet massa. Vestibulum nec urna eget libero ullamcorper euismod. Quisque non efficitur tellus. Sed vel nibh dapibus, malesuada ipsum fermentum, aliquam augue. Nam nunc nisi, faucibus quis laoreet eu, scelerisque at est. Mauris ut tortor vitae elit blandit accumsan. Suspendisse porta mauris ligula, eu ullamcorper risus lacinia ac. Donec id posuere lectus. Phasellus ornare risus vitae est auctor, sed gravida risus molestie.

              Ut auctor non purus in sagittis. In hac habitasse platea dictumst. Duis vitae congue enim, id sagittis lacus. Vestibulum laoreet auctor arcu. Suspendisse euismod cursus diam. Phasellus non elit pretium, luctus dui eu, mollis nisl. Sed elementum, purus id sagittis dictum, ipsum diam maximus dolor, ut ornare lorem augue eu tortor. Nullam pretium condimentum blandit. Suspendisse massa neque, feugiat sit amet risus vitae, hendrerit rutrum nunc. Praesent a ex rhoncus, molestie urna nec, cursus mauris. Pellentesque pellentesque mauris ipsum. In pretium ultrices nunc, nec iaculis turpis vestibulum in. Aenean sapien urna, aliquam vel sollicitudin sit amet, condimentum eget arcu. Vestibulum laoreet sed nisl non feugiat.

              Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut a porttitor tellus, vitae egestas erat. Vestibulum arcu mi, scelerisque at erat vitae, pretium semper massa. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sollicitudin vitae nulla quis elementum. Nulla nisi diam, porttitor at lectus quis, dictum consequat dolor. Mauris eros tellus, semper nec ligula id, accumsan lobortis sem. Nunc mollis malesuada ligula in euismod. Morbi vehicula tincidunt quam, et pulvinar urna dictum pulvinar.

              Nunc in turpis luctus, fermentum ipsum in, aliquam mi. Integer pharetra ipsum eget mi interdum suscipit. Nulla in rutrum felis. Ut sagittis urna ac leo porttitor feugiat. Quisque iaculis libero non volutpat ullamcorper. Etiam lobortis urna non metus tristique, ut maximus elit eleifend. Nunc varius sit amet magna at congue.

              Vivamus et lacus tellus. Vestibulum a mi vitae libero aliquet tempus. Nunc pretium tempus consequat. Etiam sollicitudin luctus libero, lacinia euismod eros vestibulum in. Phasellus pharetra, sem eu consequat suscipit, magna neque malesuada nisi, vitae aliquet massa tortor ac urna. Ut diam nunc, auctor sagittis dui vitae, porttitor imperdiet lectus. In hac habitasse platea dictumst.

              Vivamus id tristique mi. Aenean ut diam non odio mattis congue. In semper orci volutpat turpis rutrum suscipit. Quisque augue diam, porttitor quis molestie sed, tristique sit amet diam. Ut vel elit ut dui vehicula ultricies at consectetur sem. Praesent tristique, enim tincidunt venenatis blandit, nulla massa tristique lectus, nec interdum enim justo at urna. Nullam orci tortor, suscipit ac tincidunt varius, consectetur eu odio. Fusce sed blandit ipsum, congue egestas dui. Curabitur ornare nec turpis sed ultricies. Maecenas molestie ut justo at dapibus. Fusce non luctus risus. Curabitur vulputate rutrum ligula, ac molestie libero rutrum vel. Cras condimentum pretium velit, vitae feugiat justo viverra non. Nam mi tellus, suscipit eu arcu vel, fringilla suscipit dolor.

              Integer sit amet ipsum nec arcu dapibus faucibus eu quis diam. Nam fringilla ipsum ac ex ullamcorper, quis sodales orci pretium. Quisque auctor, eros sit amet accumsan cursus, sapien sapien dapibus augue, eu viverra leo elit eu ipsum. In cursus aliquet arcu, sed tincidunt orci vestibulum eu. Sed id lobortis ligula. Curabitur lacus risus, viverra eu sem et, tristique facilisis velit. Pellentesque rutrum consectetur volutpat. Aliquam vestibulum dapibus suscipit. Interdum et malesuada fames ac ante ipsum primis in faucibus. Vestibulum bibendum maximus neque eu tristique. Sed mauris dolor, mollis vel gravida vitae, lobortis vitae odio. Pellentesque congue posuere placerat. Nunc maximus tincidunt mi, sed pulvinar lorem ultrices at. Nulla sit amet elit scelerisque, fringilla neque nec, faucibus ex.

              Nam vel felis vitae quam iaculis rutrum ac nec ipsum. Donec nec erat et ipsum tincidunt sollicitudin. Nam sed hendrerit lorem. Ut sit amet augue lectus. Morbi eget erat in eros aliquet sollicitudin in nec nunc. Ut vel velit vel velit vestibulum condimentum. Fusce mauris mauris, gravida ut augue a, consectetur luctus mi. Suspendisse venenatis ultrices lacus, ac maximus velit. Sed arcu lorem, tempor quis felis quis, sollicitudin malesuada dolor. Praesent volutpat orci vitae ornare gravida. Ut luctus eros quis mauris aliquam pulvinar. Aenean ut suscipit dolor, mattis ornare leo. Nulla luctus volutpat finibus. Fusce a sollicitudin nisi. Etiam porttitor ullamcorper pellentesque.

              Ut auctor orci in sapien blandit pulvinar. Nulla suscipit neque quis sem vestibulum auctor. Maecenas mollis nisl non justo malesuada imperdiet viverra non nibh. Proin id porttitor metus, a faucibus sem. Phasellus erat risus, iaculis non est vitae, suscipit efficitur metus. Curabitur hendrerit mi in aliquet commodo. Integer suscipit, quam eget feugiat rhoncus, tortor urna interdum felis, id vulputate nibh lectus sit amet nisi.

              Praesent vitae quam cursus, efficitur eros sed, molestie dolor. Vestibulum finibus elementum nunc sed consectetur. Cras placerat nisl leo, quis maximus libero ultricies id. Maecenas iaculis tincidunt metus, in commodo dui efficitur non. Cras diam ipsum, sagittis id nisi ac, pharetra auctor ante. Aenean volutpat vehicula diam. Duis commodo egestas turpis, in facilisis dui commodo id. Praesent mattis enim ac lectus mollis, vel blandit metus tempor. Quisque eu ante ornare, posuere dolor a, scelerisque nulla. Duis ut suscipit turpis, faucibus faucibus quam. Aenean sit amet interdum nunc, quis egestas ipsum.

              Sed bibendum feugiat ultrices. Maecenas vitae metus quis eros commodo volutpat. Sed sapien eros, posuere ac blandit sit amet, eleifend vel velit. Pellentesque vitae turpis vitae dolor consequat hendrerit. Sed mattis tincidunt eros eget vulputate. Aenean vel risus imperdiet, rutrum diam eget, consequat magna. Integer non cursus metus, eu consectetur tortor. Aenean ultrices, nisi ac sollicitudin tempor, metus felis tincidunt erat, vitae ultricies velit dolor vitae mi.

              Vivamus ut iaculis purus. Donec sed est at ante cursus ornare. Ut non auctor lorem. Donec luctus erat eget magna varius, non hendrerit metus rhoncus. Duis pulvinar tempus risus, luctus convallis dui auctor sit amet. Donec dapibus neque enim, non viverra purus auctor ac. Vivamus elementum lacus eu eleifend fermentum. Aenean euismod interdum dolor sit amet imperdiet. Proin ornare vehicula turpis, a tincidunt nisl porttitor et. Praesent malesuada pretium enim sit amet sollicitudin. Integer aliquam enim in dolor elementum luctus id a tellus. Sed sed mauris varius leo sollicitudin vulputate.

              Nam tincidunt a velit eu ornare. Curabitur sollicitudin lorem ut lectus congue, nec commodo ante venenatis. Vivamus cursus hendrerit lectus, vel dictum ante. Maecenas aliquam tellus vel egestas lobortis. Ut sed fringilla erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Morbi eu odio eu metus scelerisque sodales in eget risus. In a tortor ante. Duis lectus purus, porta tincidunt gravida in, faucibus sed tortor. In non augue turpis.

              Praesent viverra orci eu est venenatis, in imperdiet nibh lacinia. Ut nec nisi cursus, pretium diam ut, lacinia risus. Quisque semper venenatis arcu, ac lacinia magna blandit a. Fusce aliquet tortor ac felis posuere, id scelerisque nisl tincidunt. Cras consectetur justo eu lorem lobortis, sit amet mattis libero feugiat. Morbi scelerisque nec lectus non consectetur. Curabitur non commodo tellus. Praesent vulputate condimentum elit. Nunc interdum metus nunc. Sed maximus velit auctor nisi malesuada, nec dapibus augue consectetur.

              Pellentesque nunc risus, consequat malesuada finibus at, fermentum ut nibh. In vel neque sed lorem convallis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Pellentesque vel mauris massa. Aenean laoreet nec neque sed placerat. Duis euismod nisl metus, ut fringilla arcu ullamcorper sit amet. Ut scelerisque ligula quis accumsan pharetra.

              Aenean pellentesque scelerisque neque, id suscipit nulla pretium sit amet. Quisque sit amet felis elit. Nulla id massa cursus, sollicitudin neque quis, fringilla nisl. Duis mollis tincidunt sapien eu rhoncus. Maecenas pretium porta nibh, et vulputate ligula commodo ut. In hac habitasse platea dictumst. Nam euismod condimentum nulla, a rutrum leo imperdiet sed. Maecenas scelerisque consequat lectus in tincidunt. Etiam semper diam augue, ac hendrerit ligula luctus at. Mauris enim sem, fringilla et feugiat vel, ultrices sit amet urna.

              Mauris vel lorem dui. Aenean iaculis, ex at aliquam facilisis, mauris orci scelerisque erat, in eleifend justo justo ut mauris. Proin consequat ipsum in hendrerit auctor. Etiam dignissim aliquam augue, venenatis viverra sapien interdum ac. Quisque interdum, risus ut ornare tincidunt, sapien risus viverra ex, at convallis nunc libero ac metus. Suspendisse velit ipsum, bibendum eget neque in, rutrum hendrerit magna. In odio orci, faucibus vel tellus et, mattis sagittis turpis. Quisque dictum ex quam, at ullamcorper sapien scelerisque eget. Aenean aliquet facilisis tortor, a efficitur neque molestie eu.

              Ut at elementum felis, et rutrum risus. In sed arcu vel felis ultricies vestibulum. Integer eleifend lorem vitae mi commodo sollicitudin. Curabitur vulputate urna ut lobortis bibendum. Sed condimentum velit sit amet diam rhoncus, sed ultrices urna commodo. Praesent congue enim id ante malesuada, in porttitor massa malesuada. Curabitur blandit odio in dui sollicitudin, sed consectetur erat maximus.

              Mauris commodo nibh non efficitur ornare. Vestibulum ligula diam, feugiat sed finibus vitae, luctus at arcu. Curabitur tincidunt tortor justo, a tincidunt dui condimentum et. Maecenas vitae elit mollis, varius tortor vel, tempor quam. Etiam tempor purus ut iaculis pulvinar. Nunc a condimentum velit. Nullam dictum lacinia varius. Pellentesque ac neque lorem. Integer bibendum vehicula pharetra. Fusce libero enim, facilisis et mi nec, lacinia aliquet odio. Proin augue tellus, elementum quis dapibus in, cursus placerat enim. Integer ut tellus tempus risus varius pretium et in magna. Curabitur commodo eget erat eget dapibus.

              Nullam fermentum orci sit amet eleifend semper. Donec non fermentum augue. Mauris aliquam eget mauris ac venenatis. In lacinia risus orci, in mollis massa tristique sed. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce a metus a turpis finibus elementum. Nunc lectus arcu, volutpat a erat sit amet, congue malesuada lorem. Mauris aliquam elementum placerat. Duis at consectetur lacus, eu cursus neque. Nulla mattis nunc et turpis condimentum, ultricies fermentum nisl volutpat. Proin libero eros, interdum non lorem a, ornare suscipit urna. Phasellus vel massa vehicula, pulvinar augue ornare, sagittis enim. Suspendisse tempor, est id accumsan egestas, mi lorem sollicitudin dui, vel sodales velit magna sit amet ante. Pellentesque id vulputate neque, eu scelerisque neque. Duis lacus enim, convallis venenatis dolor non, facilisis dapibus mauris.

              Etiam ultricies neque et neque fermentum, in porta metus laoreet. Quisque eget ultrices tellus. Proin eu nibh placerat, faucibus dui ut, facilisis elit. Proin lectus nulla, vehicula vitae nulla eu, semper hendrerit tortor. Praesent iaculis, eros ut varius accumsan, erat odio rhoncus tellus, sit amet mollis ex nibh luctus tellus. Etiam dapibus pellentesque interdum. Aliquam purus nibh, tempor eu est eu, venenatis lacinia leo. Nunc eget mi quam. Suspendisse potenti. Vivamus nec ultricies nibh, nec eleifend nulla. Nam sagittis nunc sodales mauris aliquam, et pulvinar lorem finibus. Praesent aliquet ante nec porta iaculis. Praesent sed quam quis ipsum feugiat auctor. Quisque odio dui, ornare quis nisl a, ultrices tincidunt turpis.

              Vestibulum pretium nisi nulla. Vivamus eleifend scelerisque erat. In viverra commodo imperdiet. Mauris posuere, lacus sed feugiat pharetra, lectus purus accumsan ex, a sollicitudin sapien ante in massa. Nullam lorem nulla, ornare quis dictum quis, fringilla in lorem. Sed et dolor libero. Etiam quis varius risus, at gravida magna. Mauris a sapien commodo ligula tincidunt porttitor. Nunc dui est, tempus in dui id, cursus aliquet velit. Ut hendrerit turpis a purus ornare, quis luctus dui scelerisque.

              Aenean sodales maximus justo, id maximus justo aliquam nec. Aliquam molestie lacus non erat fermentum hendrerit. Donec dignissim eleifend venenatis. Ut massa arcu, tincidunt ut velit sit amet, tempor iaculis nunc. Suspendisse potenti. Duis posuere tempus ante, vitae varius ante molestie vel. Mauris eu dolor a nulla eleifend finibus feugiat ac quam.

              Integer ut purus mattis, aliquam tellus sed, sollicitudin sem. Donec ac hendrerit ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. Mauris viverra pretium ligula, ut dignissim quam accumsan nec. Cras non mattis tellus, in interdum nibh. Mauris cursus commodo consectetur. Maecenas vitae ullamcorper elit. Ut a lacus ac tortor ultrices aliquam. Ut eu volutpat ipsum, tincidunt hendrerit nibh. Nulla eget feugiat augue. Sed ac metus scelerisque, rhoncus nisl efficitur, porttitor odio. Cras venenatis et nisi nec placerat. Pellentesque nec nisl neque. Cras pharetra lacus eu condimentum finibus. Vivamus mauris libero, varius nec ante a, venenatis iaculis arcu. Donec sem turpis, ultricies quis iaculis sed, fermentum at diam.
              123
          </div>
        );
    }

    render = () => {
        return (
            <div className="App">
                {this.renderHeader()}
                {this.renderContent(false)}
                {this.renderFooter()}
            </div>
        );
    }
}


export default App;
