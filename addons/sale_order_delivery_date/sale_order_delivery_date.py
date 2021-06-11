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

#from datetime import datetime
#from dateutil.relativedelta import relativedelta

from openerp.osv import fields, osv

class delivery_date(osv.osv):
    _inherit = 'sale.order' #TODO : inherit website_sale : héritage multiple autorisé ?

    _columns = {
        'requested_delivery_date': fields.date('Requested Delivery Date', help="Date requested by the customer for the delivery."),
    }

delivery_date()
