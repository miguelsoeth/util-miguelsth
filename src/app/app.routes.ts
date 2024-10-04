import { Routes } from '@angular/router';
import { DrawGraphSequenceComponent } from './components/components/draw-graph-sequence/draw-graph-sequence.component';
import { MenuComponent } from './components/components/menu/menu.component';
import { NetworkDegreeComponent } from './components/components/network-degree/network-degree.component';

export const routes: Routes = [
    {
        path: '',
        component: MenuComponent
    },
    {
        path: 'sequence-to-graph',
        component: DrawGraphSequenceComponent
    },
    {
        path: 'network-degree',
        component: NetworkDegreeComponent
    }
];
