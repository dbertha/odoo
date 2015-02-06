# -*- coding: utf-8 -*-
##############################################################################
#
#    OpenERP, Open Source Management Solution
#
#    This program is free software: you can redistribute it and/or modify
#    it under the terms of the GNU Affero General Public License as
#    published by the Free Software Foundation, either version 3 of the
#    License, or (at your option) any later version.
#
#    This program is distributed in the hope that it will be useful,
#    but WITHOUT ANY WARRANTY; without even the implied warranty of
#    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#    GNU Affero General Public License for more details.
#
#    You should have received a copy of the GNU Affero General Public License
#    along with this program.  If not, see <http://www.gnu.org/licenses/>.
#
##############################################################################


{
    'name': 'Delivery Date on Sale Order',
    'version': '0.1',
    'category': 'Sales Management',
    'description': """
Add an additionnal requested_delivery_date field to the sales order.
===================================================
""",
    'author': 'David Bertha',
    'website': 'http://www..com',
    #'images': ['images/sale_order_dates.jpeg'],
    'depends': ['sale_stock'],
    'data': ['sale_order_delivery_date_view.xml'],
    'demo': [],
    'test': [],
    'installable': True,
    'auto_install': False,
}
